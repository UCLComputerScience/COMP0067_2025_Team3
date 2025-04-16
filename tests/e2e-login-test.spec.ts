// tests/e2e-login.spec.ts
import { test, expect } from '@playwright/test'

test('user can log in with email and password', async ({ page }) => {
  // Go to the login page
  await page.goto('http://localhost:3000/login')

  // Fill in email and password
  await page.getByLabel('Email').fill('patient1@mail.com')
  await page.getByLabel('Password').fill('1234567')

  // Click login button
  await page.click('button[type="submit"]')

  // Wait for redirection or dashboard to appear
  await expect(page.locator('text=The Spider Questionnaire')).toBeVisible() // Change to match your app's logged-in view
})
