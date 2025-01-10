import { test, expect } from '@playwright/test';
import BasePage from '../pages/BasePage.js';
import AccountPage from '../pages/AccountPage.js';
import { loginToSalesforce } from '../utils/helpers.js';
import StringUtil from '../utils/stringUtil.js';

test.describe('Salesforce Account Creation', () => {

    let basePage;
    let accountPage;
    let accountName = "Test Account - " + StringUtil.generateRandomAlphabetic();

    test.beforeEach(async ({ page }) => {
        // Perform login
        await loginToSalesforce(page);

        // Initialize BasePage after login
        basePage = new BasePage(page);

        // Initialize AccountPage
        accountPage = new AccountPage(page);
        await basePage.ensureHomePage();
        await basePage.switchToApp('Sales');
    });

    test.only('Create a new Account in Salesforce', async ({ page }) => {
        // Navigate to Accounts
        await page.click('a[title="Accounts"]');

        // Open the New Account modal
        await accountPage.openNewAccountModal();

        // Fill the account form
        const accountDetails = {
            accountName: accountName,//'Automation Test Account',
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
        const isAccountCreated = await accountPage.verifyAccountCreated(accountName);
        expect(isAccountCreated).toBe(true);
    });
});
