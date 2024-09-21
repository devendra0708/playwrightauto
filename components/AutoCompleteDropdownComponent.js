class AutoCompleteDropdownComponent {
    constructor(page, inputSelector, resultsSelector) {
        this.page = page;
        this.inputSelector = inputSelector;  // The input field for the autocomplete
        this.resultsSelector = resultsSelector;  // The selector for the dropdown result items
    }

    // Method to type in the input and select an option from the dropdown
    async selectOption(searchText, optionText) {
        // Type the search text into the input
        await this.page.fill(this.inputSelector, searchText);

        // Wait for the options to appear (adjust timeout if needed)
        await this.page.waitForTimeout(1000);

        // Find and click the desired option by visible text
        const option = await this.page.locator(`${this.resultsSelector} lightning-base-combobox-item`, { hasText: optionText });
        await option.click();
    }

    // Method to read the currently selected value from the input (if applicable)
    async getSelectedOption() {
        return await this.page.inputValue(this.inputSelector);
    }

    // Method to get all available options in the autocomplete dropdown after typing
    async getAvailableOptions() {
        // Wait for the results to appear
        await this.page.waitForSelector(this.resultsSelector);

        // Return all available options
        const options = await this.page.locator(`${this.resultsSelector} lightning-base-combobox-item`);
        return await options.evaluateAll(opts => opts.map(option => option.textContent.trim()));
    }
}

module.exports = AutoCompleteDropdownComponent;
