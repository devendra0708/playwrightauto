class DatePickerComponent {
    constructor(page, selector) {
        this.page = page;
        this.selector = selector;
    }

    async pick(dateValue) {
        await this.page.fill(this.selector, dateValue);  // Assuming date in format 'YYYY-MM-DD'
    }
}

module.exports = DatePickerComponent;
