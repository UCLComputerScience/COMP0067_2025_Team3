import fs from 'fs'
import path from 'path'

import { test, expect } from '@playwright/test'

test('Patient logs in, updates employment, takes questionnaire and views the result', async ({ page }) => {
  // Go to the login page
  await page.goto('http://localhost:3000/login')

  // Fill in email and password
  await page.getByLabel('Email').fill('patient1@mail.com')
  await page.getByLabel('Password').fill('1234567')

  // Click login button
  await page.click('button[type="submit"]')

  // Wait for redirection or dashboard to appear
  await expect(page.locator('text=The Spider Questionnaire')).toBeVisible() // Change to match your app's logged-in view

  // move to questionnaire and fill out information form
  await page.click('text=Take The Test')

  await page.getByText('OK').click()

  await expect(page.locator('text=Patient Information')).toBeVisible()

  await page.locator('label:has-text("Select Employment Status")').locator('..').click()
  await page.getByRole('option', { name: 'In education' }).click()

  // Click Next button
  await page.getByText('Next').click()

  page.on('dialog', async dialog => {
    await dialog.accept()
  })

  const answerValues = ['0', '25', '50', '75', '100']

  // Test page 1
  for (let i = 6; i <= 9; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const div = page.locator(`#\\3${i} `)

    await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
  }

  await page.getByText('Next').click()

  // Test page 2
  for (let i = 10; i <= 12; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const escapedId = `\\3${i.toString()[0]} ${i.toString().slice(1)}`
    const div = page.locator(`#${escapedId}`)

    await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
  }

  await page.getByText('Next').click()

  // Test page 3
  for (let i = 1; i <= 5; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const div = page.locator(`#\\3${i} `)

    await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
  }

  await page.getByText('Next').click()

  // Test page 4
  for (let i = 13; i <= 16; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const escapedId = `\\3${i.toString()[0]} ${i.toString().slice(1)}`
    const div = page.locator(`#${escapedId}`)

    await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
  }

  await page.getByText('Next').click()

  // Test page 5
  for (let i = 17; i <= 20; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const escapedId = `\\3${i.toString()[0]} ${i.toString().slice(1)}`
    const div = page.locator(`#${escapedId}`)

    if (i !== 19) {
      await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
    } else {
      await div.locator(`input[type="checkbox"][value="After a meal"]`).check()
    }
  }

  await page.getByText('Next').click()

  // Test page 6
  for (let i = 21; i <= 25; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const escapedId = `\\3${i.toString()[0]} ${i.toString().slice(1)}`
    const div = page.locator(`#${escapedId}`)

    if (i !== 25) {
      await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
    } else {
      await div.locator(`input[type="radio"][value="66.6"]`).check()
    }
  }

  await page.getByText('Next').click()

  // Test page 7
  for (let i = 26; i <= 28; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const escapedId = `\\3${i.toString()[0]} ${i.toString().slice(1)}`
    const div = page.locator(`#${escapedId}`)

    await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
  }

  await page.getByText('Next').click()

  // Test page 8
  for (let i = 29; i <= 31; i++) {
    const randomValue = answerValues[Math.floor(Math.random() * answerValues.length)]
    const escapedId = `\\3${i.toString()[0]} ${i.toString().slice(1)}`
    const div = page.locator(`#${escapedId}`)

    await div.locator(`input[type="radio"][value="${randomValue}"]`).check()
  }

  await page.getByText('Next').click()

  await page
    .getByText(
      'Mark on the graph how much these symptoms have impacted your daily life during the past ONE month. (Optional)'
    )
    .waitFor({ timeout: 5000 })

  const chart = page.getByTestId('spidergram')

  const box = await chart.boundingBox()

  if (!box) throw new Error('Chart not found')

  const { x, y, width, height } = box
  const cx = x + width / 2
  const cy = y + height / 2

  const domains = 8
  const radius = Math.min(width, height) * 0.45 * 0.5 // halfway out

  for (let i = 0; i < domains; i++) {
    const angle = (2 * Math.PI * i) / domains
    const clickX = cx + radius * Math.cos(angle)
    const clickY = cy + radius * Math.sin(angle)

    await page.mouse.click(clickX, clickY)
  }

  await page.getByText('Submit').click()
  await page.waitForURL('http://localhost:3000/my-records')

  await page.getByLabel('view single record').first().click()

  const isDownloading = page.waitForEvent('download')

  await page.getByRole('button', { name: 'Export' }).click()
  const download = await isDownloading

  const downloadPath = path.join(__dirname, 'downloads', await download.suggestedFilename())

  await download.saveAs(downloadPath)

  expect(fs.existsSync(downloadPath)).toBe(true)
})
