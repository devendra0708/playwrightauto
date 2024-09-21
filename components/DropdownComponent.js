class DropdownComponent {
    constructor(page, dropdownSelector) {
        this.page = page;
        this.dropdownSelector = dropdownSelector;  // The selector for the dropdown element
    }

    // Method to select an option by visible text
    async selectByVisibleText(optionText) {
        // Wait for the dropdown to be visible
        await this.page.waitForSelector(this.dropdownSelector);

        // Click the dropdown to open the options
        await this.page.click(this.dropdownSelector);

        // Find and click the option by visible text
        const option = await this.page.locator(`option`, { hasText: optionText });
        await option.click();
    }

    // Method to read the currently selected option
    async getSelectedOption() {
        // Get the currently selected option's text
        const selectedOption = await this.page.locator(`${this.dropdownSelector} option:checked`);
        return await selectedOption.textContent();
    }

    // Method to read all available options in the dropdown
    async getAvailableOptions() {
        // Wait for the dropdown to be visible
        await this.page.waitForSelector(this.dropdownSelector);

        // Return all option texts
        const options = await this.page.locator(`${this.dropdownSelector} option`);
        return await options.evaluateAll(opts => opts.map(option => option.textContent.trim()));
    }
}

module.exports = DropdownComponent;
