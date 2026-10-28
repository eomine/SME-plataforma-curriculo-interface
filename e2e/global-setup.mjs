import fs from 'node:fs';
import path from 'node:path';
import { mode, slugsFile } from './visual/mode.mjs';

// As páginas visuais com slug (sequência, projeto, desafio...) dependem do
// conteúdo falso do banco local. Ao gravar ou ao usar a API ao vivo, os slugs
// vêm da API; ao tocar as respostas gravadas, vêm de slugs.json (se ainda não
// foram gravadas, os testes visuais explicam como gravar).
export default async function globalSetup(config) {
  if (mode === 'replay') {
    if (fs.existsSync(slugsFile)) process.env.E2E_SLUGS = fs.readFileSync(slugsFile, 'utf8');
    return;
  }

  const { baseURL } = config.projects[0].use;
  const get = async path => {
    const response = await fetch(new URL(path, baseURL));
    if (!response.ok) throw new Error(`GET ${path}: ${response.status} (a API local está no ar?)`);
    return response.json();
  };

  const sequences = await get('/api/sequencias');
  let sequence, activity;
  for (const { slug } of sequences) {
    const { activities = [] } = await get(`/api/sequencias/${slug}`);
    if (activities.length) {
      sequence = slug;
      activity = activities[0].slug;
      break;
    }
  }
  const [project] = await get('/api/projects');
  const [challenge] = await get('/api/desafios');
  const [methodology] = await get('/api/metodos/');
  const slugs = {
    sequence,
    activity,
    project: project.slug,
    challenge: challenge.slug,
    methodology: methodology.slug,
  };

  const json = JSON.stringify(slugs, null, 2) + '\n';
  if (mode === 'record') {
    // Grava do zero, para não sobrar arquivo de resposta que ninguém usa.
    fs.rmSync(path.dirname(slugsFile), { recursive: true, force: true });
    fs.mkdirSync(path.dirname(slugsFile), { recursive: true });
    fs.writeFileSync(slugsFile, json);
  }
  process.env.E2E_SLUGS = json;
}
