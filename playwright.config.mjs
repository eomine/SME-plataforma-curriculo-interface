import { defineConfig } from '@playwright/test';

// Testes de ponta a ponta (npm run e2e). Veja e2e/README.md.
//
// - desktop/mobile: capturas de tela de páginas inteiras. Tocam as respostas
//   gravadas em e2e/visual/hars, então não dependem do banco nem da API.
const baseURL = process.env.BASE_URL || 'http://localhost';

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.mjs',
  globalSetup: './e2e/global-setup.mjs',
  globalTeardown: './e2e/global-teardown.mjs',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e-report' }]],
  outputDir: 'e2e-results',
  // SNAPSHOT_DIR permite gravar ou comparar capturas fora do repositório (por
  // exemplo, as de outro branch).
  snapshotPathTemplate: process.env.SNAPSHOT_DIR
    ? `${process.env.SNAPSHOT_DIR}/{projectName}/{arg}{ext}`
    : '{testDir}/__screenshots__/{platform}/{projectName}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  use: {
    baseURL,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', testDir: 'e2e/visual', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'mobile', testDir: 'e2e/visual', use: { viewport: { width: 375, height: 812 } } },
  ],
});
