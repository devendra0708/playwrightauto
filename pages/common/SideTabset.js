class SideTabset {
    constructor(page) {
        this.page = page;
        this.activityTabSelector = 'a[title="Activity"]';  // Selector for the Activity tab
        this.chatterTabSelector = 'a[title="Chatter"]';    // Selector for the Chatter tab
    }

    // Method to switch to a tab based on the parameter
    async switchToTab(tabName) {
        if (tabName.toLowerCase() === 'activity') {
            await this.page.click(this.activityTabSelector);
            await this.page.waitForSelector(this.activityTabSelector + '.active');
        } else if (tabName.toLowerCase() === 'chatter') {
            await this.page.click(this.chatterTabSelector);
            await this.page.waitForSelector(this.chatterTabSelector + '.active');
        } else {
            throw new Error(`Unknown tab: ${tabName}`);
        }
    }
}

module.exports = SideTabset;
