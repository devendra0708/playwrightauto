class BaseElement {
    constructor(page, selector) {
        this.page = page;
        this.selector = selector;
    }

    // Click the element
    async click() {
        await this.page.click(this.selector);
    }

    // Type into the element
    async type(text) {
        await this.page.fill(this.selector, text);
    }

    // Wait for the element to be visible
    async waitForVisible() {
        await this.page.waitForSelector(this.selector, { state: 'visible' });
    }

    // Get the element text
    async getText() {
        return await this.page.textContent(this.selector);
    }
}

module.exports = BaseElement;
