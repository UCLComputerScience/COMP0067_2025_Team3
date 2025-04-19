import fs from 'fs'
import path from 'path'

import { test, expect } from '@playwright/test'

test('Clinician logs in, views results and downloads the report as a PDF', async ({ page }) => {
  await page.goto('http://localhost:3000/login')
  await page.getByLabel('Email').fill('clinician1@mail.com')
  await page.getByLabel('Password').fill('1234567')
  await page.click('button[type="submit"]')

  await page.getByText('The Spider Questionnaire').waitFor()
  await page.goto('http://localhost:3000/all-patients')

  await page.getByText('patient1 patient1').click()
  await page.getByText('Go to record list').click()
  await page.getByLabel('view single record').first().click()

  const isDownloading = page.waitForEvent('download')

  await page.getByRole('button', { name: 'Export' }).click()
  const download = await isDownloading

  const downloadPath = path.join(__dirname, 'downloads', await download.suggestedFilename())

  await download.saveAs(downloadPath)

  expect(fs.existsSync(downloadPath)).toBe(true)
})
