import { test, expect, button, globalSpinner, listItems, expandedItems } from '../support.mjs';

// Estado de UI: prévias expandidas (home, sequências, projetos), busca e
// "nova busca", loading global e o menu do celular. Deslogado; não muda dados.

const toggleFirst = page => listItems(page).first().click();

test('prévia na home', async ({ page }) => {
  await page.goto('/');
  await expect(listItems(page).first()).toBeVisible();
  await toggleFirst(page);
  await expect(expandedItems(page)).toHaveCount(1);
  await toggleFirst(page);
  await expect(expandedItems(page)).toHaveCount(0);
});

for (const path of ['/sequencias', '/projetos']) {
  test(`prévia e busca em ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(listItems(page).first()).toBeVisible();
    const total = await listItems(page).count();

    await toggleFirst(page);
    await expect(expandedItems(page)).toHaveCount(1);

    await page.locator('#query').fill('zzzz inexistente');
    await page.locator('#query').press('Enter');
    await expect(button(page, 'Fazer nova busca')).toBeVisible();
    await expect(listItems(page)).toHaveCount(0);

    await button(page, 'Fazer nova busca').click();
    await expect(listItems(page)).toHaveCount(total);
    await expect(expandedItems(page)).toHaveCount(0);
    await expect(page.locator('#query')).toHaveValue('');
  });
}

test('loading global some quando os filtros chegam', async ({ page }) => {
  // Guarda cada mudança do loading global (amostrar num instante depende do
  // tempo da API).
  await page.addInitScript(() => {
    window.spinnerStates = [];
    const check = () => {
      const on = !!document.querySelector('div[class*=wrapper][class*=isVisible]');
      if (window.spinnerStates.at(-1) !== on) window.spinnerStates.push(on);
    };
    new MutationObserver(check).observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class'],
    });
  });
  await page.goto('/objetivos-de-aprendizagem');
  await expect(page.locator('h1, h2').first()).toBeVisible();
  await expect(globalSpinner(page)).toHaveCount(0);
  expect(await page.evaluate(() => window.spinnerStates)).toContain(true);
});

test('menu do celular', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const menu = page.locator('div[class*=isExpanded]', { has: page.locator('#mobileMenu') });
  await expect(menu).toHaveCount(0);
  await page.locator('button[aria-label=Menu]').click();
  await expect(menu).toHaveCount(1);
  await page.locator('#mobileMenu button').first().click();
  await expect(menu).toHaveCount(0);
});
