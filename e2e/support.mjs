import { test as base, expect } from '@playwright/test';

// Todo teste falha se a página lançar uma exceção ou escrever um erro no console.
export const test = base.extend({
  pageErrors: [
    async ({ page }, use) => {
      const errors = [];
      page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
      page.on('console', message => message.type() === 'error' && errors.push(`console: ${message.text()}`));
      await use(errors);
      expect(errors, 'erros na página').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

// O loading global (components/layout/Loading) e os itens das listas
// (sequências, projetos) são achados pelas classes e pelo alt dos ícones, que
// valem tanto para CSS modules quanto para as classes globais antigas.
export const globalSpinner = page => page.locator('div[class*=wrapper][class*=isVisible]');
export const listItems = page => page.locator('img[alt=Expandir]:visible, img[alt=Esconder]:visible');
export const expandedItems = page => page.locator('img[alt=Esconder]:visible');
export const chips = page => page.locator('img[alt=Remover]:visible');

const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Botão visível com exatamente esse texto (os filtros não têm nome acessível
// próprio: o texto do botão é o nome).
export const button = (scope, text) =>
  scope.locator('button:visible', { hasText: new RegExp(`^\\s*${escape(text)}\\s*$`) }).first();

// Login sem o formulário, como o LoginActions.login: POST /api/login e guarda o
// accessToken. O professor vem do db:seed (prof / password).
export async function logIn(page, username = 'prof', password = 'password') {
  await page.goto('/');
  const ok = await page.evaluate(
    async ([login, pass]) => {
      const body = new FormData();
      body.append('user[login]', login);
      body.append('user[password]', pass);
      const response = await fetch('/api/login', { method: 'POST', body });
      if (!response.ok) return false;
      localStorage.setItem('accessToken', response.headers.get('Authorization'));
      return true;
    },
    [username, password]
  );
  expect(ok, 'login na API local').toBe(true);
}
