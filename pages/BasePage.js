const AppLauncherComponent = require('../components/AppLauncherComponent');

class BasePage {
    constructor(page) {
        this.page = page;

        // Initialize the AppLauncherComponent for switching apps
        this.appLauncher = new AppLauncherComponent(page);
    }

    // Method to switch to a specific app using the App Launcher
    async switchToApp(appName) {
        await this.appLauncher.switchToApp(appName);
    }

    // Default method to ensure we are logged in and can switch apps
    async ensureHomePage() {
        // Ensure you are on any page after login (optional validation or checks can be added here)
        await this.page.waitForSelector('.slds-icon-waffle');  // A generic selector that confirms you are logged in and on some page
    }
}

module.exports = BasePage;
