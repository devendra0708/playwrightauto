const { test, expect } = require('@playwright/test');
const BasePage = require('../pages/BasePage');
const AccountPage = require('../pages/AccountPage');
const { loginToSalesforce } = require('../utils/helpers');
const { username, password } = require('../utils/env');

test.describe('Salesforce Account Creation', () => {

    let basePage;
    let accountPage;

    test.beforeEach(async ({ page }) => {
        // Perform login
        await loginToSalesforce(page, username, password);

        // Initialize BasePage after login
        basePage = new BasePage(page);

        // Initialize AccountPage
        accountPage = new AccountPage(page);
        await basePage.ensureHomePage();
        await basePage.switchToApp('Sales');
    });

    test('Create a new Account in Salesforce', async ({ page }) => {
        // Navigate to Accounts
        await page.click('a[title="Accounts"]');

        // Open the New Account modal
        await accountPage.openNewAccountModal();

        // Fill the account form
        const accountDetails = {
            accountName: 'Automation Test Account',
            phone: '123-456-7890',
            website: 'https://testaccount.com',
            type: 'Customer',
            isPrivate: true,
            closeDate: '2024-12-31'
        };

        await accountPage.fillNewAccountForm(accountDetails);

        // Save the account
        await accountPage.saveAccount();

        // Verify account creation
        const isAccountCreated = await accountPage.verifyAccountCreated('Automation Test Account');
        expect(isAccountCreated).toBe(true);
    });
});
