class AppLauncherComponent {
    constructor(page) {
        this.page = page;
        this.appLauncherIcon = 'button[title="App Launcher"]';  // App launcher icon selector
        this.searchBox = 'input[placeholder="Search apps and items..."]';  // Search box in app launcher
        this.appOptionLocator = 'div.al-menu-dropdown-list a';  // Locator for app options
        this.appTitleLocator = '.appName [title]';  // Example locator for the page title element (adjust as needed)
    }

    // Method to switch to an app by its name
    async switchToApp(appName) {
        // Step 0: Check if the current page title already matches the app name
        const appTitle = await this.page.textContent(this.appTitleLocator);
        if (appTitle.trim() === appName) {
            console.log(`Already on the "${appName}" app. No switch required.`);
            return;  // Exit if already on the correct app
        }

        // Step 1: Click the App Launcher icon
        await this.page.click(this.appLauncherIcon);

        // Step 2: Wait for the search box to appear and type the app name
        await this.page.waitForSelector(this.searchBox);
        await this.page.fill(this.searchBox, appName);

        // Step 3: Wait for the list of app options to appear
        await this.page.waitForSelector(this.appOptionLocator);

        // Step 4: Get all available app options and check if any match the appName
        const appOptions = await this.page.locator(this.appOptionLocator);
        const count = await appOptions.count();

        for (let i = 0; i < count; i++) {
            const optionText = await appOptions.nth(i).textContent();

            if (optionText.trim() === appName) {
                // Step 5: Click the app with the matching name
                await appOptions.nth(i).click();
                console.log(`Switched to app: ${appName}`);

                // Wait for the app to load (optional but recommended)
                await this.page.waitForLoadState('networkidle');
                return;
            }
        }

        throw new Error(`App with name "${appName}" not found.`);
    }
}

module.exports = AppLauncherComponent;
