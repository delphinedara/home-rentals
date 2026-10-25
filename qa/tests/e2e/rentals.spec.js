const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/homes');

  await expect(
    page.getByTestId('home-card').first()
  ).toBeVisible();
});

test('displays all ten rental properties', async ({ page }) => {
  await expect(page.getByTestId('home-card')).toHaveCount(10);
});

test('filters properties by maximum monthly rent', async ({ page }) => {
  await page.getByTestId('max-rent').selectOption({
    label: '$1,000'
  });

  await expect(page.getByTestId('home-card')).toHaveCount(4);

  const rents = await page.getByTestId('home-rent').allTextContents();

  for (const rent of rents) {
    const amount = Number(rent.replace(/[^0-9]/g, ''));
    expect(amount).toBeLessThanOrEqual(1000);
  }
});

test('sorts properties by rent from low to high', async ({ page }) => {
  await page.getByTestId('sort-select').selectOption({
    label: 'Rent: low to high'
  });

  await expect(page).toHaveURL(/sort=price-asc/);

  const rents = await page.getByTestId('home-rent').allTextContents();

  const amounts = rents.map(rent =>
    Number(rent.replace(/[^0-9]/g, ''))
  );

  expect(amounts).toEqual([...amounts].sort((a, b) => a - b));
});

test('saves a property and persists it after refresh', async ({ page }) => {
  await page.getByTestId('save-property-1').click();

  await expect(page.getByTestId('saved-count')).toHaveText('1');
  await expect(page.getByTestId('monthly-total')).toHaveText('$1,650');

  await page.reload();

  await expect(page.getByTestId('saved-count')).toHaveText('1');
  await expect(page.getByTestId('monthly-total')).toHaveText('$1,650');
});

test('removes a saved property', async ({ page }) => {
  await page.getByTestId('save-property-1').click();

  await expect(page.getByTestId('saved-count')).toHaveText('1');

  await page.getByTestId('save-property-1').click();

  await expect(page.getByTestId('saved-count')).toHaveText('0');
  await expect(page.getByTestId('monthly-total')).toHaveText('$0');
});

test('clears combined filters', async ({ page }) => {
  await page.getByTestId('max-rent').selectOption({
    label: '$1,000'
  });

  await page.getByTestId('min-bedrooms').selectOption({
    label: '2+'
  });

  await expect(page.getByTestId('home-card')).toHaveCount(0);

  await page.getByTestId('clear-filters').click();

  await expect(page.getByTestId('home-card')).toHaveCount(10);
});

test('has no horizontal overflow', async ({ page }) => {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  expect(hasOverflow).toBe(false);
});
