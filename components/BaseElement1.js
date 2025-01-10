class BaseElement {
    constructor(page, selector, shadowHostSelector = null) {
        this.page = page;
        this.selector = selector;
        this.shadowHostSelector = shadowHostSelector; // Optional shadow host
        this.iframeLocator = '[title="accessibility title"]';
    }

    async click() {
        await this.page.click(this.selector);
    }

    async getText() {
        return await this.page.textContent(this.selector);
    }

    async fill(value) {
        await this.page.fill(this.selector, value);
    }

    async waitForVisible(timeout = 20000) {
        await this.page.waitForSelector(this.selector, { state: 'visible', timeout });
    }
    
    async getAttribute(attribute) {
        return await this.page.getAttribute(this.selector, attribute);
    }

    // =========================================== Element Relations =====================================

    // Get the parent element of the current element
    parentElement() {
        return new BaseElement(this.page, `${this.selector} >> xpath=..`);
    }

    // Get a parent element of the current element that matches a specific selector
    parentElement(matchingSelector) {
        // Traverse up the DOM tree to find the matching parent
        return new BaseElement(this.page, `${this.selector} >> ${matchingSelector}`);
    }

    // Get a sibling element based on a selector relative to the current element
    siblingElement(siblingSelector) {
        return new BaseElement(this.page, `${this.selector} ~ ${siblingSelector}`);
    }

    // Get all sibling elements matching a selector as BaseElement instances
    async siblingElements(siblingSelector) {
        const siblingLocators = this.page.locator(`${this.selector} ~ ${siblingSelector}`).all();
        return siblingLocators.map((_, index) =>
            new BaseElement(this.page, `${this.selector} ~ ${siblingSelector} >> nth=${index}`)
        );
    }

    async elementByText(selector, text) {
        const combinedSelector = `${selector} >> text="${text}"`;

        await this.page.locator(combinedSelector).waitFor({ state: 'visible' });
        return new BaseElement(this.page, combinedSelector);
    }

    async elementByText(text) {
        const combinedSelector = `${this.selector} >> text="${text}"`;

        await this.page.locator(combinedSelector).waitFor({ state: 'visible' });
        return new BaseElement(this.page, combinedSelector);
    }

    // Get a child element relative to the current element (element chaining)
    childElement(childSelector) {
        return new BaseElement(this.page, `${this.selector} ${childSelector}`);
    }

    // Method to get a child element relative to a specified parent element
    static childElement(parentBaseElement, childSelector) {
        const combinedSelector = `${parentBaseElement.selector} ${childSelector}`;
        return new BaseElement(parentBaseElement.page, combinedSelector);
    }

    async childElementByText(childSelector, text) {
        const childSelectorWithText = `${this.selector} >> ${childSelector}:has-text("${text}")`;
        await this.page.locator(childSelectorWithText).waitFor({ state: 'visible' });
        
        // Return a new BaseElement instance for chaining
        return new BaseElement(this.page, childSelectorWithText);
    }

    async childElementByText2(text) {
        const selectorWithText = `${this.selector} >> :scope >> :has-text("${text}")`;
        await this.page.locator(selectorWithText).waitFor({ state: 'visible' });
        
        // Return a new BaseElement instance for chaining
        return new BaseElement(this.page, selectorWithText);
    }

    // Get a list of child elements as BaseElement instances
    async childElements(childSelector) {
        const parentLocator = this.page.locator(this.selector);
        const childLocators = await parentLocator.locator(childSelector).all(); // Retrieve all matching elements

        // Map each child locator to a new BaseElement instance
        return childLocators.map((_, index) =>
            new BaseElement(this.page, `${this.selector} >> nth=${index}`)
        );
    }

    // Chain through multiple levels (multi-level chaining)
    multiLevelChild(...selectors) {
        let chainedSelector = this.selector;
        for (const selector of selectors) {
            chainedSelector = `${chainedSelector} ${selector}`;
        }
        return new BaseElement(this.page, chainedSelector);
    }

    // Chain child locators
    chain(...selectors) {
        let locator = this.page.locator(this.selector);
        for (const selector of selectors) {
            locator = locator.locator(selector);
        }
        return locator;
    }

    /**
     * Finds a parent element that contains a child with the specified text.
     * @param {string} parentSelector - Selector for the parent element (e.g., 'ul > li', '.container').
     * @param {string} childSelector - Selector for the child element to search within (e.g., 'span').
     * @param {string} searchText - The text content to match in the child element.
     * @returns {BaseElement} - A new BaseElement instance representing the found parent element.
     */
    async getElementContainingText(parentSelector, childSelector, searchText) {
        // Construct a generic selector to find the parent element with the specified child containing text
        const combinedSelector = `${parentSelector}:has(${childSelector}:text-is("${searchText}"))`;
        const elementLocator = this.page.locator(combinedSelector);

        // Ensure at least one matching element exists
        if (await elementLocator.count() === 0) {
            throw new Error(`No element found with selector "${parentSelector}" containing "${childSelector}" with text "${searchText}"`);
        }

        // Return a new BaseElement instance for chaining or further interaction
        return new BaseElement(this.page, combinedSelector);
    }

    // Method to get a single element matching a selector within the parent element
    async getElement(childSelector) {
        const parentLocator = this.page.locator(this.selector);
        const childLocator = parentLocator.locator(childSelector);
        await childLocator.waitFor({ state: 'visible' });
        return childLocator;
    }

    // Method to get all elements matching a selector within the parent element
    async getElements(childSelector) {
        const parentLocator = this.page.locator(this.selector);
        const childLocators = parentLocator.locator(childSelector);
        
        // Wait for at least one matching element to be visible
        await this.page.waitForSelector(`${this.selector} >> ${childSelector}`, { state: 'visible' });
        
        return childLocators; // Returns Playwright Locator objects
    }
    
    async getBaseElement(childSelector) {
        return new BaseElement(this.page, `${this.selector} >> ${childSelector}`);
    }

    async getBaseElements(childSelector) {
        const parentLocator = this.page.locator(this.selector);
        const childLocators = await parentLocator.locator(childSelector).all(); // Get all matching elements

        // Check if at least one element exists and is visible
        if (childLocators.length > 0) {
            await childLocators[0].waitFor({ state: 'visible' });
        }
        
        // Map each child locator to a new BaseElement instance
        return childLocators.map((_, index) =>
            new BaseElement(this.page, `${this.selector} >> nth=${index}`)
        );
    }

    // Usage :
    // const list = new BaseElement(page, 'ul');
    // Use the generic method to find an <li> element with the text 'textvalue'
    // const listItem = await list.getChildElementByText('li', 'textvalue');
    async getChildElementByText(childSelector, text) {
        const parentLocator = this.page.locator(this.selector);
        const childLocator = parentLocator.locator(childSelector, { hasText: text });
        await childLocator.waitFor({ state: 'visible' }); // Ensure visibility before interacting
        return childLocator;
    }

    async getElementByText(selector, text) {
        const element = await this.page.locator(`${selector} >> text="${text}"`);
        await element.waitFor({ state: 'visible' });
        return element;
    }

    async getElementMatchingText(selector, text) {
        const elements = this.page.locator(selector);
        const matchingElement = elements.locator(`:scope >> text="${text}"`);

        // Ensure the element exists
        const count = await matchingElement.count();
        if (count === 0) {
            throw new Error(`No element found with text: ${text}`);
        }

        return matchingElement;
    }

    async getElementWithChildTitle(childSelector, titleText) {
        const listElements = this.page.locator(this.selector);
        const count = await listElements.count();
        
        for (let i = 0; i < count; i++) {
            const listItem = listElements.nth(i);
            const childWithTitle = listItem.locator(`${childSelector}[title="${titleText}"]`);

            if (await childWithTitle.count() > 0) {
                return new BaseElement(this.page, `${this.selector} >> nth=${i}`);
            }
        }

        throw new Error(`No element found in ${this.selector} with child matching title "${titleText}"`);
    }

    async findListWrapperByChildTitle(childTitle) {
        const listWrappers = this.page.locator(`${this.selector} .listWrapper`);
        const count = await listWrappers.count();
    
        for (let i = 0; i < count; i++) {
            const wrapper = listWrappers.nth(i);
            const matchingChild = wrapper.locator(`[title="${childTitle}"]`);
    
            if (await matchingChild.count() > 0) {
                return new BaseElement(this.page, `${this.selector} .listWrapper >> nth=${i}`);
            }
        }
    
        throw new Error(`No .listWrapper element found with child element title="${childTitle}"`);
    }

    //=========================================== JS Query Operations ===========================================

    // JS-based click method to click on the element
    async jsClick() {
        await this.page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (element) {
                element.click();  // Click using native JS
            } else {
                throw new Error(`Element with selector ${sel} not found`);
            }
        }, this.selector);  // Use the selector stored in the instance
    }

    // JS-based click method for shadow DOM and iframe (without passing iframe title)
    async jsClickForShadowDOM() {
        if (this.shadowHostSelector) {
            // If shadowHostSelector is provided, handle shadow DOM and iframe click using default iframe title
            const element = await this.getShadowElementInsideIFrame(this.selector, this.shadowHostSelector);
            await this.page.evaluate(el => el.click(), await element.elementHandle()); // Perform JS click on the target element
        } else {
            // Fallback to normal jsClick if no shadow DOM is involved
            await this.jsClick();
        }
    }

    //=========================================== Shadow Root Operations ===========================================

    async getShadowElement(targetElementSelector, shadowHostSelector = '#sbPageContainer') {
        const element = await this.page.evaluateHandle(({ shadowHostSelector, targetElementSelector }) => {
            const shadowHost = document.querySelector(shadowHostSelector);
            if (shadowHost && shadowHost.shadowRoot) {
                return shadowHost.shadowRoot.querySelector(targetElementSelector);
            }
            return null;
        }, { shadowHostSelector, targetElementSelector });
    
        if (!element) throw new Error(`Element not found for ${targetElementSelector}`);
        return element;
    }

    async getShadowElements(targetElementSelector, shadowHostSelector = '#sbPageContainer') {
        const elements = await this.page.evaluateHandle(
            (shadowHostSelector, targetElementSelector) => {
                const shadowHost = document.querySelector(shadowHostSelector);
                if (shadowHost && shadowHost.shadowRoot) {
                    return shadowHost.shadowRoot.querySelectorAll(targetElementSelector);
                }
                return [];
            },
            shadowHostSelector, targetElementSelector
        );
        return elements;
    }

    async getNestedShadowElements(childShadowSelector, nestedTargetSelector, shadowHostSelector = '#sbPageContainer') {
        const nestedElements = await this.page.evaluateHandle(
            (shadowHostSelector, childShadowSelector, nestedTargetSelector) => {
                const shadowHost = document.querySelector(shadowHostSelector);
                if (!shadowHost || !shadowHost.shadowRoot) return null;
                const shadowChild = shadowHost.shadowRoot.querySelector(childShadowSelector);
                if (!shadowChild || !shadowChild.shadowRoot) return null;
                return shadowChild.shadowRoot.querySelectorAll(nestedTargetSelector);
            },
            shadowHostSelector, childShadowSelector, nestedTargetSelector
        );
        if (!nestedElements) throw new Error(`Nested elements not found for ${nestedTargetSelector}`);
        return nestedElements;
    }

    //=========================================== Shadow Root Operations in iFrame ===========================================
    
    async getShadowElementInsideIFrame( targetElementSelector, shadowHostSelector = '#sbPageContainer') {
        
        // Switch to the iframe using frameLocator with title attribute
        const iframe = this.page.frameLocator(this.iframeLocator);
    
        // Access the shadow DOM layers using frameLocator
        const shadowHost = iframe.locator(shadowHostSelector);
        const targetElement = shadowHost.locator(targetElementSelector);
    
        await targetElement.waitFor({ state: 'visible' });

        return targetElement;
    }

    async getShadowElementsInsideIFrame( targetElementSelector, shadowHostSelector = '#sbPageContainer') {
        // Switch to the iframe using frameLocator with title attribute
        const iframe = this.page.frameLocator(this.iframeLocator);
    
        // Access the shadow DOM layers using frameLocator
        const shadowHost = iframe.locator(shadowHostSelector);  // Shadow host inside iframe
        
        // Locate all elements that match the targetElementSelector inside the shadow DOM
        const targetElements = await shadowHost.locator(targetElementSelector).elementHandles();
    
        // Wait for each target element to be visible
        for (const element of targetElements) {
            await element.waitForElementState('visible');
        }
    
        return targetElements;  // Return an array of matching elements
    }

    async clickShadowElementInIFrame(shadowHostSelector, targetElementSelector) {
        // Switch to the iframe using frameLocator with title attribute
        const iframe = this.page.frameLocator(this.iframeLocator);
    
        // Access the shadow DOM layers using frameLocator
        const shadowHost = iframe.locator(shadowHostSelector);  // Shadow host inside iframe
        const targetElement = shadowHost.locator(targetElementSelector);  // Target element inside the shadow DOM
    
        // Wait for the target element to be visible
        await targetElement.waitFor({ state: 'visible' });
    
        // Perform the click
        await targetElement.click();
    }

    async clickButtonInsideShadowIFrame(shadowHostSelector, buttonId, buttonName ) {
        // Access the shadow host inside the iframe
        const shadowHost = await this.getShadowElementInsideIFrame(shadowHostSelector);
        
        // Locate the button by name and ID within the shadow host
        const buttonByName = shadowHost.locator(`[name="${buttonName}"]`);
        const targetButton = buttonByName.locator(`#${buttonId}`);
        
        // Wait for the button to be visible and click it
        await targetButton.waitFor({ state: 'visible' });
        await targetButton.click();
    }
    
    async isVisibleInShadow(shadowHostSelector, targetSelector) {
        try {
            const iframe = this.page.frameLocator(this.iframeLocator);
            const shadowHost = iframe.locator(shadowHostSelector);
            const targetElement = shadowHost.locator(targetSelector);
            
            const isVisible = await targetElement.isVisible();
    
            console.log(`Element visibility in shadow DOM: ${targetSelector} - ${isVisible}`);
            return isVisible;
        } catch (error) {
            console.log(`Error checking visibility for element inside shadow DOM: ${targetSelector}`);
            return false;
        }
    }
    
}

export default BaseElement;
