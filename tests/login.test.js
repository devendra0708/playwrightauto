import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage.js';

test.describe.skip('Salesforce Login', () => {
    test('Login to Salesforce and verify dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto('https://techm139-dev-ed.develop.my.salesforce.com');
        await loginPage.login('dev100@test.com', 'Madmax.11111');

        // Wait for dashboard to load and verify
        await expect(page.locator('.slds-icon-waffle')).toBeVisible();

        await page.waitForTimeout(10000);
    });
});
