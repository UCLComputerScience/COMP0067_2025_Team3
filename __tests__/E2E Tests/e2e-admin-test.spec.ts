// tests/e2e-login.spec.ts
import { test, expect } from '@playwright/test'

test('Admin logs in and approves a study', async ({ page }) => {
  // Go to the login page
  await page.goto('http://localhost:3000/login')

  // Fill in email and password
  await page.getByLabel('Email').fill('admin1@mail.com')
  await page.getByLabel('Password').fill('1234567')

  // Click login button
  await page.click('button[type="submit"]')

  // Wait for redirection or dashboard to appear
  await expect(page.locator('text=The Spider Questionnaire')).toBeVisible()

  await page.goto('http://localhost:3000/studies')
  await page.locator('table button.MuiIconButton-root').first().click()

  await page.locator('label:has-text("Decision")').locator('..').click()
  await page.getByRole('option', { name: 'Approved' }).click()

  await page.click('button[type="submit"]')

  await page.waitForURL('http://localhost:3000/all-users/a7ff6f85-a49c-4970-94e0-77496541c123')
  expect(page.url()).toBe('http://localhost:3000/all-users/a7ff6f85-a49c-4970-94e0-77496541c123')
})
