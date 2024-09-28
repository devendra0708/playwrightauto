const { test, expect } = require('@playwright/test');
const BasePage = require('../pages/BasePage');
const { loginToSalesforce } = require('../utils/helpers');
const { username, password } = require('../config/env');

test.describe.skip('Salesforce Account Creation', () => {

    let basePage;

    // This will run before each test and perform login
    test.beforeEach(async ({ page }) => {
        // Perform login before each test
        await loginToSalesforce(page, username, password);

        // Initialize BasePage after login
        basePage = new BasePage(page);

        // Ensure we are on some home page (optional)
        await basePage.ensureHomePage();
        await basePage.switchToApp('Sales');
    });

    // Test for creating a new account
    test('Create a new Account in Salesforce', async ({ page }) => {
        // Step 1: Navigate to the Accounts page
         // Switch to the Sales app or Accounts app based on your setup

        // Click on the Accounts tab to navigate to the Accounts list view
        await page.click('a[title="Accounts"]');  // Adjust the selector based on your Salesforce UI
        
        // Step 2: Click the "New" button to create a new account
        await page.click('div[title="New"]');

        // Step 3: Fill in the new account form
        await page.fill('input[name="Account Name"]', 'Test Account Automation');  // Fill in the Account Name

        // Select "Type" dropdown (if applicable)
        await page.selectOption('select[name="Type"]', { label: 'Customer' });  // Adjust as per your Salesforce form

        // You can also fill other optional fields here (Phone, Website, etc.)
        await page.fill('input[name="Phone"]', '123-456-7890');
        await page.fill('input[name="Website"]', 'https://testaccount.com');

        // Step 4: Save the new account
        await page.click('button[title="Save"]');  // Adjust the selector if needed

        // Step 5: Verify the new account is created by checking the existence of the account's name on the page
        const accountHeader = await page.textContent('lightning-formatted-text[data-output-element-id="output-field"]');  // Adjust the selector to match the Account Name field
        expect(accountHeader).toBe('Test Account Automation');
    });
});
