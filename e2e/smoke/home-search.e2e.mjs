import { test, expect, button, listItems } from '../support.mjs';

// Busca da home: segmento, etapa, ano e componente nos popovers e "Buscar",
// que leva à lista de sequências com os filtros. Deslogado; não muda dados.

// Abre o campo (pelo texto atual), escolhe a opção no popover e fecha.
async function pick(page, field, option) {
  await page.locator('div[role=button]:visible', { hasText: field }).click();
  const popover = page.locator('.MuiPopover-paper').last();
  await button(popover, option).click();
  await button(popover, 'Fechar').click();
  await expect(popover).toBeHidden();
}

const field = (page, text) => page.locator('div[role=button]:visible span', { hasText: text });

test('busca da home', async ({ page }) => {
  await page.goto('/');
  await expect(listItems(page).first()).toBeVisible();
  await expect(field(page, 'Todos os segmentos')).toBeVisible();

  await pick(page, 'segmentos', 'Ensino Fundamental');
  await expect(field(page, 'Ensino Fundamental')).toBeVisible();
  await pick(page, 'etapa', 'Ciclo de Alfabetização');
  await expect(field(page, 'Ciclo de Alfabetização')).toBeVisible();
  await pick(page, 'ano', '1º ano');
  await expect(field(page, '1º ano')).toBeVisible();
  await pick(page, 'omponente', 'Arte');
  await expect(field(page, '1 componente')).toBeVisible();

  const search = page.waitForRequest(request => {
    const url = decodeURIComponent(request.url());
    return (
      url.includes('/api/sequencias?') &&
      /segment_id\[\]=\d+/.test(url) &&
      /stage_id\[\]=\d+/.test(url) &&
      /year_ids\[\]=\d+/.test(url) &&
      url.includes('curricular_component_slugs[]=arte')
    );
  });
  await button(page, 'Buscar').click();
  await search;
  await expect(page).toHaveURL(/\/sequencias$/);
});
