const TextInputComponent = require('../components/TextInputComponent');
const DropdownComponent = require('../components/DropdownComponent');
const CheckboxComponent = require('../components/CheckboxComponent');
const DatePickerComponent = require('../components/DatePickerComponent');

class AccountPage {
    constructor(page) {
        this.page = page;
        this.accountNameInput = new TextInputComponent(page, 'input[name="Name"]');
        this.phoneInput = new TextInputComponent(page, 'input[name="Phone"]');
        this.websiteInput = new TextInputComponent(page, 'input[name="Website"]');
        // this.typeDropdown = new DropdownComponent(page, 'select[name="Type"]');
        // this.privateCheckbox = new CheckboxComponent(page, 'input[name="Private"]');
        // this.closeDateInput = new DatePickerComponent(page, 'input[name="Close Date"]');
        this.newButtonSelector = 'div[title="New"]';
        this.saveButtonSelector = '[apiname="SaveEdit"][title="Save"]';
    }

    // Open the "New Account" modal
    async openNewAccountModal() {
        await this.page.click(this.newButtonSelector);
    }

    // Fill the new account form using the components
    async fillNewAccountForm(accountDetails) {
        const { accountName, phone, website/*, type, isPrivate, closeDate*/ } = accountDetails;

        await this.accountNameInput.fill(accountName);
        await this.phoneInput.fill(phone);
        await this.websiteInput.fill(website);
        // await this.typeDropdown.selectByLabel(type);
        
        // if (isPrivate) {
        //     await this.privateCheckbox.check();
        // } else {
        //     await this.privateCheckbox.uncheck();
        // }

        // if (closeDate) {
        //     await this.closeDateInput.pick(closeDate);
        // }
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
}

module.exports = AccountPage;
