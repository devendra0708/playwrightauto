const { loginToSalesforce } = require('../utils/helpers');  // Salesforce login helper
const { username, password } = require('../config/env');      // Username and password from environment variables
const AppLauncherComponent = require('../components/AppLauncherComponent');  // Component for app switching

class BaseTest {
    constructor() {
        // Any common properties or methods shared across all tests can be defined here
    }

    // Setup method to login before every test (if needed)
    async setup(page) {
        console.log('Setting up test...');
        
        // Perform login
        await loginToSalesforce(page, username, password);  
        console.log('Login successful, proceeding to switch apps...');

        // Initialize AppLauncherComponent to switch apps
        const appLauncher = new AppLauncherComponent(page);
        
        // Switch to the "Sales" app after login
        await appLauncher.switchToApp('Sales');
        console.log('Switched to Sales app successfully.');
    }

    // Teardown method to perform any cleanup after the test (optional)
    async teardown() {
        // Add any global cleanup logic here if needed
        console.log('Cleaning up after test...');
    }

    // Optional method to ensure the page is loaded before a test step
    async ensurePageIsLoaded(page, url) {
        console.log('Navigating to:', url);
        await page.goto(url);
        await page.waitForLoadState('networkidle');  // Wait until the network is idle
    }

    // Method to take a screenshot on failure
    async takeScreenshotOnFailure(page, testName) {
        const screenshotPath = `screenshots/${testName}.png`;
        console.log(`Taking screenshot for test failure: ${screenshotPath}`);
        await page.screenshot({ path: screenshotPath });
    }

    // Utility method to verify page title
    async verifyPageTitle(page, expectedTitle) {
        const actualTitle = await page.title();
        console.log(`Verifying page title: Expected - "${expectedTitle}", Actual - "${actualTitle}"`);
        return actualTitle === expectedTitle;
    }
}

module.exports = BaseTest;
