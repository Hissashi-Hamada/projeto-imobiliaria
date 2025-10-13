import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('http://localhost:5173/login');

  await page.fill('input[type="email"]', 'admin@imobiliaria.test');
  await page.fill('input[type="password"]', 'Demo@12345');

  // submit and wait a short time for SPA navigation / localStorage change
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // check if localStorage user is set
  const user = await page.evaluate(() => window.localStorage.getItem('user'));
  expect(user).not.toBeNull();
});