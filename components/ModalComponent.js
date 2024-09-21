class ModalComponent {
    constructor(page) {
        this.page = page;
    }

    // Method to fill a text input field
    async fillTextInput(selector, value) {
        await this.page.fill(selector, value);
    }

    // Method to select an option from a dropdown
    async selectDropdown(selector, value) {
        await this.page.selectOption(selector, { label: value });
    }

    // Method to click a checkbox
    async clickCheckbox(selector, shouldCheck = true) {
        const isChecked = await this.page.isChecked(selector);
        if (shouldCheck !== isChecked) {
            await this.page.click(selector);
        }
    }

    // Method to pick a date from a date picker (assuming input date field)
    async pickDate(selector, dateValue) {
        await this.page.fill(selector, dateValue);  // Assuming you pass 'YYYY-MM-DD'
    }

    // Method to handle filling multiple fields at once (dynamic)
    async fillFormFields(fields) {
        for (const field of fields) {
            const { type, selector, value } = field;

            switch (type) {
                case 'text':
                    await this.fillTextInput(selector, value);
                    break;
                case 'dropdown':
                    await this.selectDropdown(selector, value);
                    break;
                case 'checkbox':
                    await this.clickCheckbox(selector, value);
                    break;
                case 'date':
                    await this.pickDate(selector, value);
                    break;
                default:
                    console.log(`Field type "${type}" is not supported.`);
                    break;
            }
        }
    }

    // Method to submit the modal (save)
    async submitForm(saveButtonSelector = 'button[title="Save"]') {
        await this.page.click(saveButtonSelector);
    }
}

module.exports = ModalComponent;
