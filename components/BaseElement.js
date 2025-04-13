class BaseElement {
    constructor(page, selector) {
        this.page = page;
        this.selector = typeof selector === "string" ? selector : null;
        this.locator = typeof selector === "string" ? page.locator(selector) : selector;
    }

    /**
     * Returns the current Playwright locator.
     * Ensures correct locator chaining for elements.
     */
    getLocator() {
        return this.locator;
    }

    /**
     * Returns a readable string of the locator path.
     */
    toString() {
        return this.getLocator().toString();
    }

    //=========================================== Basic Element Actions ===========================================

    async click() {
        await this.getLocator().click();
    }

    async getText() {
        return await this.getLocator().textContent();
    }

    async fill(value) {
        await this.getLocator().fill(value);
    }

    async hover() {
        await this.getLocator().hover();
    }

    async getAttribute(attribute) {
        return await this.getLocator().getAttribute(attribute);
    }

    /**
     * Returns raw ElementHandle instances for all matching elements.
     */
    async getElementHandles() {
        return await this.getLocator().elementHandles() || [];
    }

    /**
     * Returns all matching elements wrapped as BaseElement instances.
     */
    async getElements() {
        const count = await this.getLocator().count();

        // Create an array of BaseElement instances for each matching locator (using nth)
        return Promise.all(
            Array.from({ length: count }, (_, i) =>
                new BaseElement(this.page, this.getLocator().nth(i))
            )
        );
    }

    async waitForVisible(timeout = 30000) {
        const selector = this.selector; // Ensure we have the original selector
        await this.page.waitForSelector(selector, { state: 'attached', timeout }); // Wait for it to be in the DOM
        await this.page.waitForSelector(selector, { state: 'visible', timeout });  // Ensure it's visible
    }

    //=========================================== Element Relations ===========================================

    /**
     * Get the parent element of the current element.
     */
    parentElement(matchingSelector = null) {
        const parentLocator = matchingSelector
            ? this.getLocator().locator(`.. >> ${matchingSelector}`)
            : this.getLocator().locator('..');

        return new BaseElement(this.page, parentLocator);
    }

    /**
     * Get a sibling element based on a selector.
     */
    siblingElement(siblingSelector) {
        const siblingLocator = this.getLocator().locator(`~ ${siblingSelector}`);
        return new BaseElement(this.page, siblingLocator);
    }

    /**
     * Get a child element relative to the current element.
     */
    async childElement(childSelector) {
        const childLocator = this.getLocator().locator(childSelector).first();

        if (await childLocator.count() === 0) {
            throw new Error(`No child element found for selector: ${childSelector}`);
        }

        return new BaseElement(this.page, childLocator);
    }

    /**
     * Get a list of child elements as BaseElement instances.
     */
    async childElements(childSelector) {
        const childLocators = await this.getLocator().locator(childSelector).all();
        return childLocators.map((locator) => new BaseElement(this.page, locator));
    }

    //=========================================== Element Matching ===========================================

    /**
     * Find an element by its text.
     */
    async elementByText(text) {
        const elements = this.getLocator().locator(`:scope >> text-is("${text}")`);
        const firstElement = elements.first();

        return new BaseElement(this.page, firstElement);
    }

    /**
     * Find a child element by its text.
     */
    async childElementByText(childSelector, text) {
        const childLocatorWithText = this.getLocator().locator(`${childSelector}:has-text("${text}")`).first();
        await childLocatorWithText.waitFor({ state: 'visible' });

        return new BaseElement(this.page, childLocatorWithText);
    }

    /**
     * Find an element matching text in a list.
     */
    async getListElementByText(text) {
        const elements = this.getLocator();
        const matchingElement = elements.locator(`:scope >> text="${text}"`);

        if (await matchingElement.count() === 0) {
            throw new Error(`No element found with text: ${text}`);
        }

        return new BaseElement(this.page, matchingElement.first());
    }

    //=========================================== JS Query Operations ===========================================

    /**
     * Click an element using JavaScript (useful for hidden elements).
     */
    async jsClick() {
        const locator = this.getLocator();
        await this.page.evaluate(el => el.click(), await locator.elementHandle());
    }

    //=========================================== Conditional Operations ===========================================

    async isVisible() {
        return await this.getLocator().isVisible();
    }

    async isEnabled() {
        return await this.getLocator().isEnabled();
    }

    async isEditable() {
        return await this.getLocator().isEditable();
    }

    async isDisabled() {
        return await this.getLocator().isDisabled();
    }
}

export default BaseElement;
