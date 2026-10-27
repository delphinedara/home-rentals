const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('rental listings meet automated WCAG accessibility checks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();

  const accessibilityScan = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const violations = accessibilityScan.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    elements: violation.nodes.map((node) => node.target)
  }));

  expect(violations).toEqual([]);
});
