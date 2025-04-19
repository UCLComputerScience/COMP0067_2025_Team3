import path from 'path'

import { test } from '@playwright/test'

test('Researcher logs in and sets up a new study', async ({ page }) => {
  // Log in as researcher 1
  await page.goto('http://localhost:3000/login')
  await page.getByLabel('Email').fill('researcher1@mail.com')
  await page.getByLabel('Password').fill('1234567')
  await page.click('button[type="submit"]')

  // Navigate to study application
  await page.getByText('The Spider Questionnaire').waitFor()
  await page.goto('http://localhost:3000/my-profile')
  await page.getByText('Researcher Account Settings').waitFor()

  await page.pause()
  const deleteButton = page.locator('button:has-text("Delete")')

  if ((await deleteButton.count()) > 0) {
    await deleteButton.click()

    // If there's a confirm dialog
    page.locator('button:has-text("Yes, Delete")').click()
  } else {
    console.log('No study to delete — skipping delete step')
  }

  await page.getByText('Add New Study and Apply for Data Access').click()

  // Fill in form
  await page.getByLabel('Research Title').fill('Test Study')
  await page.getByLabel('Research Question').fill('Test Question')
  await page.locator('label:has-text("Institution")').locator('..').click()
  await page.getByRole('option', { name: 'University College London (UCL)' }).click()
  await page.getByLabel('Summary').fill('This is a test description')

  const fileInput = page.locator('input[type="file"]')

  await fileInput.setInputFiles(path.join('./sample-research-proposal.pdf'))

  await page.getByLabel('Expected start date to end date').click()

  // Wait for the calendar to appear
  await page.locator('.react-datepicker').waitFor({ state: 'visible' })

  // Click the start date (e.g., April 2)
  await page.locator('.react-datepicker__day--002').last().click()

  // Click the end date (e.g., April 10)
  await page.locator('.react-datepicker__day--010').last().click()

  await page.getByLabel('Age').click()
  await page.getByLabel('Ethnicity').click()

  await page.getByLabel('Single episode questionnaire').click()
  await page.click('button[type="submit"]')

  // Check for redirection
  await page.getByText('Researcher Account Settings').waitFor()
})
