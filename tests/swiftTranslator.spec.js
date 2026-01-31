const { test, expect } = require('@playwright/test');
const path = require('path');

test('SwiftTranslator demo UI automation test', async ({ page }) => {

  // Open local demo file
  const filePath = path.resolve(__dirname, '../demo.html');
  await page.goto('file://' + filePath);

  // Check title exists
  await expect(page).toHaveTitle(/Swift Translator/i);

  // Locate elements
  const inputBox = page.locator('#input');
  const outputBox = page.locator('#output');

  // Type text
  await inputBox.fill('oyaata kohomadha?');

  // Validate output is NOT empty (UI behavior test)
  const outputValue = await outputBox.inputValue();
  expect(outputValue.length).toBeGreaterThan(0);

});
