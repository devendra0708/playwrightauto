const { username, password, baseURL } = require('./env');  // Import baseURL

async function loginToSalesforce(page) {
    // Check if the user is already logged in
    const isLoggedIn = await page.locator('.slds-icon-waffle').isVisible({ timeout: 5000 }).catch(() => false);

    if (isLoggedIn) {
        console.log("Already logged in, skipping login step.");
        return;
    }

    // If not logged in, proceed with the login process
    console.log("Not logged in, performing login.");
    await page.goto(`${baseURL}/`);  // Use baseURL for the login page

    await page.fill('input#username', username);
    await page.fill('input#password', password);
    await page.click('input#Login');

    // Wait for the login to complete
    await page.waitForSelector('.slds-icon-waffle');
    console.log("Login successful.");
}

module.exports = { loginToSalesforce };
