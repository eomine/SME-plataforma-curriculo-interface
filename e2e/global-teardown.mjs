import fs from 'node:fs';
import path from 'node:path';
import { mode, harsDir, appOrigin } from './visual/mode.mjs';

// Depois de gravar, tira das respostas gravadas o que não deve ir para o
// repositório: o POST do login (com a senha) e os cabeçalhos das requisições
// (com o token). E troca a origem do app (http://localhost:4102, por exemplo)
// por uma fixa, para tocar as respostas em qualquer porta.
export default function globalTeardown(config) {
  if (mode !== 'record') return;

  const { origin } = new URL(config.projects[0].use.baseURL);
  for (const file of fs.readdirSync(harsDir).filter(name => name.endsWith('.har'))) {
    const harPath = path.join(harsDir, file);
    const har = JSON.parse(fs.readFileSync(harPath, 'utf8'));
    har.log.entries = har.log.entries
      .filter(({ request }) => !request.url.includes('/api/login'))
      .map(entry => ({
        ...entry,
        request: {
          ...entry.request,
          url: entry.request.url.startsWith(origin + '/')
            ? appOrigin + entry.request.url.slice(origin.length)
            : entry.request.url,
          headers: [],
          cookies: [],
        },
      }));
    fs.writeFileSync(harPath, JSON.stringify(har, null, 2) + '\n');
  }
}
