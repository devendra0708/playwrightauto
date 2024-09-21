class TextInputComponent {
    constructor(page, selector) {
        this.page = page;
        this.selector = selector;
    }

    async fill(value) {
        await this.page.fill(this.selector, value);
    }
}

module.exports = TextInputComponent;
