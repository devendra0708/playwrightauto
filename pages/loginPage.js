class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameField = 'input[id="username"]';
        this.passwordField = 'input[id="password"]';
        this.loginButton = 'input#Login';
    }

    async login(username, password) {
        await this.page.fill(this.usernameField, username);
        await this.page.fill(this.passwordField, password);
        await this.page.click(this.loginButton);
    }
}

module.exports = LoginPage;