import { test, expect, button, chips, listItems } from '../support.mjs';

// Painel de filtros de sequências e de projetos: segmento -> etapa -> ano,
// componente, categoria (objetivos de aprendizagem), buscar, chips, remover
// chip, ordenação e "nova busca". Deslogado; não muda dados.

const lists = [
  { path: '/sequencias', search: 'Buscar Sequência', api: '/api/sequencias' },
  { path: '/projetos', search: 'Buscar Projetos', api: '/api/projects' },
];

// O primeiro título "Filtros" é o do painel (o outro é o das categorias).
const panel = page =>
  page
    .locator('h1', { hasText: /^Filtros$/ })
    .first()
    .locator('xpath=ancestor::div[contains(@class, "wrapper")][1]');
const categoryPanel = page =>
  page.locator('div[class*=isShowing], div[class*=isVisible]', { has: page.locator('h2') }).last();

for (const { path, search, api } of lists) {
  test(`filtros em ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(listItems(page).first()).toBeVisible();

    await button(page, 'Filtros').click();
    await expect(panel(page)).toHaveClass(/isExpanded/);

    // Segmento, etapa e ano abrem as opções seguintes e viram chips
    await button(panel(page), 'Ensino Fundamental').click();
    await expect(button(panel(page), 'Ensino Fundamental')).toHaveClass(/isActive/);
    await button(panel(page), 'Ciclo de Alfabetização').click();
    await button(panel(page), '1º ano').click();
    await expect(button(panel(page), '1º ano')).toHaveClass(/isActive/);
    await button(panel(page), 'Arte').click();
    await expect(button(panel(page), 'Arte')).toHaveClass(/isActive/);
    await expect(chips(page)).toHaveCount(4);

    // Categoria com ano e componente: abre a lista e volta
    await button(page, 'Objetivos de Aprendizagem').click();
    await expect(categoryPanel(page).locator('h2')).toHaveText('Objetivos de Aprendizagem');
    await categoryPanel(page).locator('button[class*=back]:visible').click();
    // O painel desliza para fora da tela, mas continua no DOM
    await expect(categoryPanel(page)).toHaveCount(0);

    // Buscar fecha o painel e pede a lista com os filtros
    const filtered = page.waitForRequest(
      request => request.url().includes(api) && /year_ids\[\]=\d+/.test(decodeURIComponent(request.url()))
    );
    await button(page, search).click();
    await filtered;
    await expect(panel(page)).not.toHaveClass(/isExpanded/);
    await expect(chips(page)).toHaveCount(4);

    // Tirar o chip do segmento leva a etapa junto
    await chips(page).first().click();
    await expect(chips(page)).toHaveCount(2);

    // A ordenação entra na próxima busca
    await page.locator('[role=combobox]:visible').click();
    await page.locator('li[role=option]:visible').nth(1).click();
    await expect(page.locator('.MuiSelect-nativeInput')).toHaveValue('alphabetic');

    const none = page.waitForRequest(request => {
      const url = decodeURIComponent(request.url());
      return url.includes(api) && url.includes('q=zzzz inexistente') && url.includes('order_by=title');
    });
    await page.locator('#query').fill('zzzz inexistente');
    await page.locator('#query').press('Enter');
    await none;
    await expect(button(page, 'Fazer nova busca')).toBeVisible();
    await expect(listItems(page)).toHaveCount(0);

    // "Nova busca" limpa a busca e os filtros
    await button(page, 'Fazer nova busca').click();
    await expect(chips(page)).toHaveCount(0);
    await expect(listItems(page).first()).toBeVisible();
    await expect(page.locator('#query')).toHaveValue('');

    // Categoria sem etapa nem componente: alerta
    await button(page, 'Filtros').click();
    await button(page, 'Objetivos de Aprendizagem').click();
    const alert = page.locator('.ReactModal__Content', { hasText: 'Selecione uma etapa ou componente curricular.' });
    await expect(alert).toBeVisible();
    await button(alert, 'OK').click();
    await expect(alert).toHaveCount(0);
  });
}
