const { test, expect } = require('@playwright/test');
const AccountPage = require('../pages/AccountPage');
const BaseTest = require('../tests/BaseTest');
const { username, password } = require('../utils/env');

class AccountTabTest extends BaseTest {
    constructor() {
        super();
    }

    async verifyAccountDetails(page) {
        const accountPage = new AccountPage(page);

        // Switch to Details tab and get account details
        const { accountName, phone, website } = await accountPage.getAccountDetails();

        // Verify the account name, phone, and website
        expect(accountName.trim()).toBe('Automation Test Account');
        expect(phone.trim()).toBe('123-456-7890');
        expect(website.trim()).toBe('https://testaccount.com');
    }

    async logCallInActivityTab(page) {
        const accountPage = new AccountPage(page);

        // Switch to Activity tab and log a call
        await accountPage.logACall();
    }

    async switchToChatterTab(page) {
        const accountPage = new AccountPage(page);

        // Switch to Chatter tab
        await accountPage.switchToChatter();
    }
}

test.describe('Account Tabs Test', () => {
    const accountTabTest = new AccountTabTest();

    test.beforeEach(async ({ page }) => {
        // Login before running tests
        await accountTabTest.setup(page, username, password);
    });

    test('Switch to Details tab and verify account details', async ({ page }) => {
        await accountTabTest.verifyAccountDetails(page);
    });

    test('Switch to Activity tab and log a call', async ({ page }) => {
        await accountTabTest.logCallInActivityTab(page);
    });

    test('Switch to Chatter tab', async ({ page }) => {
        await accountTabTest.switchToChatterTab(page);
    });

    test.afterEach(async () => {
        // Cleanup if necessary
        await accountTabTest.teardown();
    });
});
