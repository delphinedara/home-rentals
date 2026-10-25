const { test, expect } = require('@playwright/test');

test('Express server sends security headers', async ({ request }) => {
  const response = await request.get('/homes');

  expect(response.status()).toBe(200);

  const headers = response.headers();

  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe(
    'strict-origin-when-cross-origin'
  );

  expect(headers['x-powered-by']).toBeUndefined();
});
