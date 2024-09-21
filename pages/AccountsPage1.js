const TableComponent = require('../components/TableComponent');
const AppLauncherComponent = require('../components/AppLauncherComponent');
const DropdownComponent = require('../components/DropdownComponent');
const AutoCompleteDropdownComponent = require('../components/AutoCompleteDropdownComponent');

class AccountsPage {
    constructor(page) {
        this.page = page;

        // Selector for the Accounts table
        this.tableSelector = 'table[data-aura-class="uiVirtualDataTable"]';  // Adjust as per actual table selector
        this.table = new TableComponent(page, this.tableSelector);

        // Other selectors for Accounts page
        this.newButton = 'button[name="New"]';  // Selector for the "New" button

        // Selectors for the modal
        this.accountNameField = 'input[name="Account Name"]';
        this.parentAccountField = 'input[title="Search Accounts"]';  // Autocomplete for Parent Account
        this.accountNumberField = 'input[name="Account Number"]';
        this.phoneField = 'input[name="Phone"]';
        this.websiteField = 'input[name="Website"]';
        this.typeDropdownField = 'select[name="Type"]';  // Static dropdown for Type
        this.industryDropdownField = 'select[name="Industry"]';  // Static dropdown for Industry
        this.saveButton = 'button[name="SaveEdit"]';  // "Save" button

        // Initialize DropdownComponent for the Type and Industry fields (static dropdowns)
        this.typeDropdown = new DropdownComponent(page, this.typeDropdownField);
        this.industryDropdown = new DropdownComponent(page, this.industryDropdownField);

        // Initialize AutoCompleteDropdownComponent for the Parent Account field (autocomplete dropdown)
        this.parentAccountDropdown = new AutoCompleteDropdownComponent(page, this.parentAccountField, 'ul.slds-listbox__list');  // Adjust resultsSelector as needed
    }

    // Navigate to the Accounts list page
    async navigateTo() {
        await this.page.goto('/lightning/o/Account/list?filterName=Recent');  // Adjust URL if needed
    }

    // Create a new account by interacting with the modal
    async createAccount(accountName, parentAccount, accountNumber, phone, website, type, industry) {
        await this.page.click(this.newButton);  // Click the "New" button

        // Wait for the modal to appear
        await this.page.waitForSelector(this.accountNameField);

        // Fill in the account details
        await this.page.fill(this.accountNameField, accountName);
        await this.page.fill(this.accountNumberField, accountNumber);
        await this.page.fill(this.phoneField, phone);
        await this.page.fill(this.websiteField, website);

        // Use AutoCompleteDropdownComponent to select the Parent Account
        if (parentAccount) {
            await this.parentAccountDropdown.selectOption(parentAccount, parentAccount);
        }

        // Use DropdownComponent to select the Type from a static dropdown
        if (type) {
            await this.typeDropdown.selectByVisibleText(type);
        }

        // Use DropdownComponent to select the Industry from a static dropdown
        if (industry) {
            await this.industryDropdown.selectByVisibleText(industry);
        }

        // Save the new account
        await this.page.click(this.saveButton);
        await this.page.waitForSelector('table[data-aura-class="uiVirtualDataTable"]');  // Wait for table to reappear after save
    }

    // Find an account by name and return the row element
    async findAccountRowByName(accountName) {
        const columnIndex = 0;  // Assuming Account Name is in the first column
        return await this.table.findRowByCellValue(columnIndex, accountName);
    }

    // Get value from a specific cell (e.g., Account Name, Phone, etc.)
    async getAccountCellValue(rowIndex, columnIndex) {
        return await this.table.getCellValue(rowIndex, columnIndex);
    }

    // Click an action button in a specific cell
    async clickAccountAction(rowIndex, columnIndex, buttonSelector) {
        return await this.table.clickButtonInCell(rowIndex, columnIndex, buttonSelector);
    }
}

module.exports = AccountsPage;
