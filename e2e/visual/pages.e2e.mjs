import fs from 'node:fs';
import path from 'node:path';
import { test, expect, globalSpinner, logIn } from '../support.mjs';
import { mode, harsDir, notRecorded, replayHar } from './mode.mjs';

// Capturas de página inteira, no desktop e no celular (veja os projetos no
// playwright.config.mjs). :slug vem de hars/slugs.json (ou da API, ao gravar).
const pages = [
  { name: 'home', path: '/' },
  { name: 'sequencias', path: '/sequencias' },
  { name: 'sequencia', path: '/sequencia/:sequence' },
  { name: 'atividade', path: '/atividade/:sequence/:activity' },
  { name: 'projetos', path: '/projetos' },
  { name: 'projeto', path: '/projeto/:project' },
  { name: 'desafio', path: '/desafio/:challenge' },
  { name: 'ods', path: '/ods' },
  { name: 'ods-detalhe', path: '/ods/1' },
  { name: 'matriz-de-saberes', path: '/matriz-de-saberes' },
  { name: 'matriz-de-saberes-detalhe', path: '/matriz-de-saberes/1' },
  { name: 'objetivos-de-aprendizagem', path: '/objetivos-de-aprendizagem' },
  { name: 'curriculo-ensino-fundamental', path: '/curriculo-ensino-fundamental' },
  { name: 'curriculo-ensino-medio', path: '/curriculo-ensino-medio' },
  { name: 'tecnologias-para-aprendizagem', path: '/tecnologias-para-aprendizagem' },
  { name: 'metodologia', path: '/metodologia/:methodology' },
  { name: 'login', path: '/login' },
  { name: 'perfil', path: '/perfil', login: true },
  { name: 'novo-projeto', path: '/novo-projeto', login: true },
  { name: 'consultas-publicas', path: '/consultas-publicas', login: true },
];

// Lido na hora do teste: o globalSetup, que preenche E2E_SLUGS, não roda no --list.
const resolve = route => {
  const slugs = JSON.parse(process.env.E2E_SLUGS);
  return route.replace(/:(\w+)/g, (_, key) => slugs[key]);
};

// API, imagens do Active Storage e tudo o que vem de fora (fontes, MathJax).
const recorded = /^https?:\/\/(?!localhost[:/])|\/(api|rails|assets)\//;

// Espera a página parar: rede, loading global, fontes, imagens e MathJax.
async function settle(page) {
  await page.waitForLoadState('networkidle');
  await expect(globalSpinner(page)).toHaveCount(0);
  // Carrega todos os pesos do Open Sans, não só os já usados: um negrito que
  // chega depois muda a largura do texto e a quebra das linhas.
  await page.evaluate(() => Promise.all([...document.fonts].map(font => font.load())));
  await page.waitForFunction(() => [...document.images].every(image => image.complete));
  // O ExpandableLearningObjective mede a altura do objetivo aberto uma vez, ao
  // montar; se a fonte ainda não chegou, a medida varia de uma execução para
  // outra. Mede de novo, agora com a fonte carregada.
  await page.evaluate(() => {
    for (const description of document.querySelectorAll('[class*=isExpanded] > [class*=description][style*=height]')) {
      description.style.height = `${description.scrollHeight}px`;
    }
  });
  await page.waitForFunction(() => {
    if (!document.querySelector('script[src*=mathjax]')) return true;
    const { MathJax } = window;
    return MathJax?.isReady && !MathJax.Hub.queue.running && !MathJax.Hub.queue.pending;
  });
}

for (const { name, path: route, login } of pages) {
  test(name, async ({ page }, testInfo) => {
    await page.clock.setFixedTime(new Date('2026-10-01T12:00:00-03:00'));
    const harPath = path.join(harsDir, `${testInfo.project.name}-${name}.har`);
    if (mode === 'record') {
      await page.routeFromHAR(harPath, { url: recorded, update: true, updateContent: 'attach', updateMode: 'minimal' });
    } else if (mode === 'replay') {
      if (!process.env.E2E_SLUGS || !fs.existsSync(harPath)) throw new Error(notRecorded);
      await replayHar(page, harPath, recorded, testInfo.project.use.baseURL);
    }
    if (login) {
      // Tocando as respostas gravadas, qualquer token serve.
      if (mode === 'replay') await page.addInitScript(() => localStorage.setItem('accessToken', 'Bearer e2e'));
      else await logIn(page);
    }

    await page.goto(resolve(route));
    await settle(page);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
