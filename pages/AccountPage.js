const TextInputComponent = require('../components/TextInputComponent');
const DropdownComponent = require('../components/DropdownComponent');
const CheckboxComponent = require('../components/CheckboxComponent');
const DatePickerComponent = require('../components/DatePickerComponent');
const MainTabset = require('./common/MainTabset');  // For switching between Related and Details
const SideTabset = require('./common/SideTabset');  // For switching between Activity and Chatter

class AccountPage {
    constructor(page) {
        this.page = page;
        this.accountNameInput = new TextInputComponent(page, 'input[name="Name"]');
        this.phoneInput = new TextInputComponent(page, 'input[name="Phone"]');
        this.websiteInput = new TextInputComponent(page, 'input[name="Website"]');
        this.newButtonSelector = 'div[title="New"]';
        this.saveButtonSelector = '[apiname="SaveEdit"][title="Save"]';

        // Components for switching tabs
        this.mainTabset = new MainTabset(page);  // Main tabset: Related and Details
        this.sideTabset = new SideTabset(page);  // Side tabset: Activity and Chatter
    }

    // Open the "New Account" modal
    async openNewAccountModal() {
        await this.page.click(this.newButtonSelector);
    }

    // Fill the new account form using the components
    async fillNewAccountForm(accountDetails) {
        const { accountName, phone, website } = accountDetails;

        await this.accountNameInput.fill(accountName);
        await this.phoneInput.fill(phone);
        await this.websiteInput.fill(website);
    }

    // Save the form
    async saveAccount() {
        await this.page.click(this.saveButtonSelector);
    }

    // Verify if account is created by checking the account name header
    async verifyAccountCreated(accountName) {
        const accountHeader = await this.page.textContent('lightning-formatted-text[slot="primaryField"]');
        return accountHeader.trim() === accountName;
    }

    // Switch to Details tab and retrieve account details
    async getAccountDetails() {
        await this.mainTabset.switchToTab('Details');  // Switch to the Details tab
        const accountName = await this.detailsSection.getAccountName();
        const phone = await this.detailsSection.getPhoneNumber();
        const website = await this.detailsSection.getWebsite();

        return { accountName, phone, website };
    }

    // Switch to Related tab and create a new contact
    async createNewContactFromRelated() {
        await this.mainTabset.switchToTab('Related');  // Switch to the Related tab
        // Logic to interact with the related list and create a new contact
    }

    // Switch to Activity tab in the side tabset and log a call
    async logACall() {
        await this.sideTabset.switchToTab('Activity');  // Switch to the Activity tab
        // Logic to log a call from the Activity tab
    }

    // Switch to Chatter tab in the side tabset
    async switchToChatter() {
        await this.sideTabset.switchToTab('Chatter');  // Switch to the Chatter tab
    }
}

module.exports = AccountPage;
