const { test, expect } = require('@playwright/test');

test('rental data endpoint returns valid properties', async ({ request }) => {
  const response = await request.get('/assets/homes.json');

  expect(response.status()).toBe(200);

  const homes = await response.json();

  expect(Array.isArray(homes)).toBe(true);
  expect(homes).toHaveLength(10);

  const ids = new Set();

  for (const home of homes) {
    expect(Number.isInteger(home.id)).toBe(true);
    expect(home.id).toBeGreaterThan(0);
    expect(ids.has(home.id)).toBe(false);
    ids.add(home.id);

    expect(typeof home.title).toBe('string');
    expect(home.title.trim().length).toBeGreaterThan(0);

    expect(['Apartment', 'Room', 'House']).toContain(home.type);

    expect(typeof home.location).toBe('string');
    expect(home.location.trim().length).toBeGreaterThan(0);

    expect(typeof home.monthlyRent).toBe('number');
    expect(home.monthlyRent).toBeGreaterThan(0);

    expect(Number.isInteger(home.bedrooms)).toBe(true);
    expect(home.bedrooms).toBeGreaterThanOrEqual(0);
  }
});
