class MainTabset {
    constructor(page) {
        this.page = page;
        this.relatedTabSelector = 'a[title="Related"]';  // Selector for the Related tab
        this.detailsTabSelector = 'a[title="Details"]';  // Selector for the Details tab
    }

    // Method to switch to a tab based on the parameter
    async switchToTab(tabName) {
        if (tabName.toLowerCase() === 'related') {
            await this.page.click(this.relatedTabSelector);
            await this.page.waitForSelector(this.relatedTabSelector + '.active');
        } else if (tabName.toLowerCase() === 'details') {
            await this.page.click(this.detailsTabSelector);
            await this.page.waitForSelector(this.detailsTabSelector + '.active');
        } else {
            throw new Error(`Unknown tab: ${tabName}`);
        }
    }
}

module.exports = MainTabset;
