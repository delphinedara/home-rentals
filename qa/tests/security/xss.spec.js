const { test, expect } = require('@playwright/test');

test('search input does not execute injected JavaScript', async ({ page }) => {
  let dialogTriggered = false;

  page.on('dialog', async dialog => {
    dialogTriggered = true;
    await dialog.dismiss();
  });

  await page.goto('/homes');

  const payload = '<img src=x onerror=alert(1)>';

  await page.getByTestId('home-search-input').fill(payload);

  await expect(page.getByTestId('home-card')).toHaveCount(0);

  expect(dialogTriggered).toBe(false);
});
