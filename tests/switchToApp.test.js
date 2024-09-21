const { test, expect } = require('@playwright/test');
const BasePage = require('../pages/BasePage');
const { loginToSalesforce } = require('../utils/helpers');
const { username, password } = require('../utils/env');

// Main test suite for app switching
test.describe.skip('Switch to App using App Launcher', () => {

    let basePage;

    // This will run before each test and perform login
    test.beforeEach(async ({ page }) => {
        // Perform login before each test
        await loginToSalesforce(page, username, password);

        // Initialize BasePage after login
        basePage = new BasePage(page);
        
        // Ensure we are on some home page (optional)
        await basePage.ensureHomePage();
    });

    // Test for switching and verifying the "Sales" app
    test('Verify navigation to Sales App', async ({ page }) => {
        // Step 1: Switch to the "Sales" app before running the test
        await basePage.switchToApp('Sales');
        
        // Step 2: Define the app title locator (adjust the selector according to your page structure)
        const appTitleLocator = '.appName [title]';  // Adjust this selector based on the app title element

        // Step 3: Get the app title text
        const appTitle = await page.textContent(appTitleLocator);

        // Step 4: Check if the app title matches 'Sales'
        expect(appTitle.trim()).toBe('Sales');
    });

    // Test for switching and verifying the "Service" app
    test('Verify navigation to Service App', async ({ page }) => {
        // Step 1: Switch to the "Service" app before running the test
        await basePage.switchToApp('Service');
        
        // Step 2: Define the app title locator (adjust the selector according to your page structure)
        const appTitleLocator = '.appName [title]';  // Adjust this selector based on the app title element

        // Step 3: Get the app title text
        const appTitle = await page.textContent(appTitleLocator);

        // Step 4: Check if the app title matches 'Service'
        expect(appTitle.trim()).toBe('Service');
    });
});
