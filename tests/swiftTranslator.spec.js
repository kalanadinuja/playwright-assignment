
const { test, expect } = require('@playwright/test');

test.describe('SwiftTranslator Singlish to Sinhala Translation Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');
    await page.waitForLoadState('networkidle');
  });

  
  async function testTranslation(page, input, timeout = 1000) {
    
    const selectors = [
      'input[type="text"]',
      'textarea',
      '[id*="input"]',
      '[class*="input"]',
      '[placeholder*="text"]'
    ];
    
    let inputField;
    for (const selector of selectors) {
      const element = page.locator(selector).first();
      if (await element.count() > 0) {
        inputField = element;
        break;
      }
    }
    
    if (!inputField) {
      
      await page.click('body');
      await page.keyboard.type(input);
    } else {
      await inputField.fill(input);
    }
    
    await page.waitForTimeout(timeout);
    
    
    const outputSelectors = [
      '[id*="output"]',
      '[class*="output"]',
      '[class*="result"]',
      'div[contenteditable="true"]',
      'textarea:not([id*="input"])'
    ];
    
    let outputField;
    for (const selector of outputSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0) {
        outputField = element.last();
        break;
      }
    }
    
    let output = '';
    if (outputField) {
      output = await outputField.textContent() || '';
    } else {
      
      await page.screenshot({ path: `screenshots/${Date.now()}.png` });
    }
    
    return output.trim();
  }

  // POSITIVE TEST CASES - 24 scenarios 
  const positiveTests = [
    { id: 'Pos_Fun_0001', input: 'oyaa sathutindha inne?', expected: 'oyaa sathutindha inne?' }, 
    { id: 'Pos_Fun_0002', input: 'nangi padam karanawa, ayya salli hoyanawa', expected: 'nangi padam karanawa, ayya salli hoyanawa' },
    { id: 'Pos_Fun_0003', input: 'bas eka parakku unoth, mama train eke ennam', expected: 'bas eka parakku unoth, mama train eke ennam' },
    { id: 'Pos_Fun_0004', input: 'api heta beach yamu', expected: 'api heta beach yamu' },
    { id: 'Pos_Fun_0005', input: 'me potha kiyawanna', expected: 'me potha kiyawanna' },
    { id: 'Pos_Fun_0006', input: 'mata badagini', expected: 'mata badagini' },
    { id: 'Pos_Fun_0007', input: 'mata salli ne', expected: 'mata salli ne' },
    { id: 'Pos_Fun_0008', input: 'suba udasanak wewa', expected: 'suba udasanak wewa' },
    { id: 'Pos_Fun_0009', input: 'karunakara mata udaw karanna', expected: 'karunakara mata udaw karanna' },
    { id: 'Pos_Fun_0010', input: 'machan, mokada wenne?', expected: 'machan, mokada wenne?' },
    { id: 'Pos_Fun_0011', input: 'bus eka giyada?', expected: 'bus eka giyada?' },
    { id: 'Pos_Fun_0012', input: 'sri lankawe lassana than', expected: 'sri lankawe lassana than' },
    { id: 'Pos_Fun_0013', input: 'mage gama nuwara', expected: 'mage gama nuwara' },
    { id: 'Pos_Fun_0014', input: 'hemin hemin yanna', expected: 'hemin hemin yanna' },
    { id: 'Pos_Fun_0015', input: 'mama eye film ekak baluwa', expected: 'mama eye film ekak baluwa' },
    { id: 'Pos_Fun_0016', input: 'api labana sathiye trip ekak yamu', expected: 'api labana sathiye trip ekak yamu' },
    { id: 'Pos_Fun_0017', input: 'eya heta enne na', expected: 'eya heta enne na' },
    { id: 'Pos_Fun_0018', input: 'lamai sellam karanawa', expected: 'lamai sellam karanawa' },
    { id: 'Pos_Fun_0019', input: 'ow', expected: 'ow' },
    { id: 'Pos_Fun_0020', input: 'mama ude nagitala wathura biwwa, ita passe dath mada gaththa', expected: 'mama ude nagitala wathura biwwa, ita passe dath mada gaththa' },
    { id: 'Pos_Fun_0021', input: 'lankawe ithihasaya bohomayak purana nisa apita eya igena ganna godak dewal thiyenawa. ape rata wata muhuda thiyena nisa apita lassana werala thiyenawa. yawwanayo me dewal rakaganna ona.', expected: 'lankawe ithihasaya bohomayak purana nisa apita eya igena ganna godak dewal thiyenawa. ape rata wata muhuda thiyena nisa apita lassana werala thiyenawa. yawwanayo me dewal rakaganna ona.' },
    { id: 'Pos_Fun_0022', input: 'oya mage laptop eka use karannada?', expected: 'oya mage laptop eka use karannada?' },
    { id: 'Pos_Fun_0023', input: 'dan welawa 10.30 yi', expected: 'dan welawa 10.30 yi' },
    { id: 'Pos_Fun_0024', input: 'oya enawada? nathnam man yanawa!', expected: 'oya enawada? nathnam man yanawa!' },
  ];

  positiveTests.forEach(({ id, input, expected }) => {
    test(`${id} - Should handle "${input.substring(0, 20)}..."`, async ({ page }) => {
      const output = await testTranslation(page, input);
      
      expect(output).toBe(expected);
    });
  });

  // NEGATIVE TEST CASES - 10 scenarios 
  const negativeTests = [
    { id: 'Neg_Fun_0001', input: 'schooooool', description: 'extended character repetition' },
    { id: 'Neg_Fun_0002', input: 'm@ma gdr ynw', description: 'special chars within words' },
    { id: 'Neg_Fun_0003', input: 'ma23ma ya34nawa', description: 'random numbers inside words' },
    { id: 'Neg_Fun_0004', input: 'gm', description: 'chat shorthand "gm"' },
    { id: 'Neg_Fun_0005', input: 'n'.repeat(100), description: 'extremely long token' },
    { id: 'Neg_Fun_0006', input: '<b>bold</b>', description: 'HTML tags' },
    { id: 'Neg_Fun_0007', input: 'www.google.com', description: 'URL input' },
    { id: 'Neg_Fun_0008', input: 'MAMA GEDARA YANAWA', description: 'ALL CAPS input' },
    { id: 'Neg_Fun_0009', input: 'm m g d r y n w', description: 'consonant only input' },
    { id: 'Neg_Fun_0010', input: 'mÃma', description: 'non-standard ascii' },
  ];

  negativeTests.forEach(({ id, input, description }) => {
    test(`${id} - Should fail for "${description}"`, async ({ page }) => {
      const output = await testTranslation(page, input);
     
      expect(output).toBe(input); 
    });
  });

  // UI TEST CASES
  test('Pos_UI_0001 - Verify input field exists', async ({ page }) => {
    
    const inputFields = await page.locator('input, textarea').count();
    expect(inputFields).toBeGreaterThan(0);
  });

  test('Neg_UI_0001 - Verify translation NOT happening (system failure)', async ({ page }) => {
    const input = 'mama gedhara yanavaa';
    const output = await testTranslation(page, input);
    
    expect(output).toBe(input);
  });
});