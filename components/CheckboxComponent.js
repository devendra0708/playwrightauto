class CheckboxComponent {
    constructor(page, selector) {
        this.page = page;
        this.selector = selector;
    }

    // Method to check the checkbox
    async check() {
        const isChecked = await this.page.isChecked(this.selector);
        if (!isChecked) {
            await this.page.check(this.selector);
        }
    }

    // Method to uncheck the checkbox
    async uncheck() {
        const isChecked = await this.page.isChecked(this.selector);
        if (isChecked) {
            await this.page.uncheck(this.selector);
        }
    }

    // Method to verify if the checkbox is checked
    async isChecked() {
        return await this.page.isChecked(this.selector);
    }
}

module.exports = CheckboxComponent;
