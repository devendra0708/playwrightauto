class StringUtil {
    /**
     * Convert string to lowercase
     * @param {string} str
     * @returns {string}
     */
    static toLowerCase(str) {
        return str ? str.toLowerCase() : str;
    }

    /**
     * Convert string to uppercase
     * @param {string} str
     * @returns {string}
     */
    static toUpperCase(str) {
        return str ? str.toUpperCase() : str;
    }

    /**
     * Capitalize the first letter of the string
     * @param {string} str
     * @returns {string}
     */
    static capitalizeFirstLetter(str) {
        if (!str || typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Trim whitespace from both sides of a string
     * @param {string} str
     * @returns {string}
     */
    static trim(str) {
        return str ? str.trim() : str;
    }

    /**
     * Check if a string contains another substring
     * @param {string} str
     * @param {string} substring
     * @returns {boolean}
     */
    static contains(str, substring) {
        if (!str || !substring) return false;
        return str.includes(substring);
    }

    /**
     * Check if a string is empty or consists only of whitespace
     * @param {string} str
     * @returns {boolean}
     */
    static isEmptyOrWhitespace(str) {
        return !str || str.trim() === '';
    }

    /**
     * Remove all spaces from a string
     * @param {string} str
     * @returns {string}
     */
    static removeSpaces(str) {
        return str ? str.replace(/\s+/g, '') : str;
    }

    /**
     * Replace all instances of a substring within a string
     * @param {string} str
     * @param {string} searchValue
     * @param {string} newValue
     * @returns {string}
     */
    static replaceAll(str, searchValue, newValue) {
        if (!str || !searchValue || !newValue) return str;
        return str.split(searchValue).join(newValue);
    }

    /**
     * Reverse the characters of a string
     * @param {string} str
     * @returns {string}
     */
    static reverse(str) {
        return str ? str.split('').reverse().join('') : str;
    }

     /**
     * Generate a random string of alphabetic characters (A-Z, a-z).
     * @param {number} length - The length of the generated string (default is 5).
     * @returns {string}
     */
     static generateRandomAlphabetic(length = 5) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
    }

    /**
     * Generate a random string of alphanumeric characters (A-Z, a-z, 0-9).
     * @param {number} length - The length of the generated string (default is 5).
     * @returns {string}
     */
    static generateRandomAlphanumeric(length = 5) {
        const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => alphanumeric[Math.floor(Math.random() * alphanumeric.length)]).join('');
    }

    /**
     * Generate a random string of numeric characters (0-9).
     * @param {number} length - The length of the generated string (default is 5).
     * @returns {string}
     */
    static generateRandomNumeric(length = 5) {
        const numbers = '0123456789';
        return Array.from({ length }, () => numbers[Math.floor(Math.random() * numbers.length)]).join('');
    }

    /**
     * Extracts the Salesforce object ID from a URL.
     * @param {string} url - The Salesforce URL.
     * @returns {string} - The extracted object ID.
     */
    static extractObjectId(url) {
        const regex = /\/r\/\w+\/([a-zA-Z0-9]{15,18})\//;
        const match = url.match(regex);
        
        if (match && match[1]) {
            return match[1];
        } else {
            throw new Error('Object ID not found in the URL');
        }
    }
}

module.exports = StringUtil;
