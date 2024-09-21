const TableComponent = require('../components/TableComponent');  // Correct the path to components folder
const DropdownComponent = require('../components/DropdownComponent');
const AutoCompleteDropdownComponent = require('../components/AutoCompleteDropdownComponent');

class OpportunityPage {
    constructor(page) {
        this.page = page;

        // Selector for the Opportunities table
        this.tableSelector = 'table[data-aura-class="uiVirtualDataTable"]';  // Adjust as per actual table selector
        this.table = new TableComponent(page, this.tableSelector);

        // Other selectors for Opportunity page
        this.newButton = 'button[name="New"]';  // Selector for the "New" button

        // Selectors for the modal
        this.opportunityNameField = 'input[name="Opportunity Name"]';
        this.accountNameField = 'input[title="Search Accounts"]';  // Autocomplete input for account
        this.closeDateField = 'input[name="Close Date"]';
        this.stageField = 'select[name="Stage"]';  // Static dropdown for Stage
        this.saveButton = 'button[name="SaveEdit"]';  // "Save" button

        // Initialize DropdownComponent for the Stage field (static dropdown)
        this.stageDropDown = new DropdownComponent(page, this.stageField);

        // Initialize AutoCompleteDropdownComponent for the Account Name field (autocomplete dropdown)
        this.accountDropDown = new AutoCompleteDropdownComponent(page, this.accountNameField, 'ul.slds-listbox__list');  // Adjust resultsSelector as needed
    }

    // Navigate to the Opportunities list page
    async navigateTo() {
        await this.page.goto('/lightning/o/Opportunity/list?filterName=Recent');  // Adjust URL if needed
    }

    // Create a new opportunity by interacting with the modal
    async createOpportunity(opportunityName, accountName, stage, closeDate) {
        await this.page.click(this.newButton);  // Click the "New" button

        // Wait for the modal to appear
        await this.page.waitForSelector(this.opportunityNameField);

        // Fill in the opportunity details
        await this.page.fill(this.opportunityNameField, opportunityName);
        await this.page.fill(this.closeDateField, closeDate);

        // Use DropdownComponent to select the Stage from a static dropdown
        await this.stageDropDown.selectByVisibleText(stage);

        // Use AutoCompleteDropdownComponent to select the Account from an autocomplete dropdown
        await this.accountDropDown.selectOption(accountName, accountName);

        // Save the new opportunity
        await this.page.click(this.saveButton);
        await this.page.waitForSelector('table[data-aura-class="uiVirtualDataTable"]');  // Wait for table to reappear after save
    }

    // Find an opportunity by name and return the row element
    async findOpportunityRowByName(opportunityName) {
        const columnIndex = 0;  // Assuming Opportunity Name is in the first column
        return await this.table.findRowByCellValue(columnIndex, opportunityName);
    }

    // Get value from a specific cell (e.g., Opportunity Name, Account Name, etc.)
    async getOpportunityCellValue(rowIndex, columnIndex) {
        return await this.table.getCellValue(rowIndex, columnIndex);
    }

    // Click an action button in a specific cell
    async clickOpportunityAction(rowIndex, columnIndex, buttonSelector) {
        return await this.table.clickButtonInCell(rowIndex, columnIndex, buttonSelector);
    }
}

module.exports = OpportunityPage;
