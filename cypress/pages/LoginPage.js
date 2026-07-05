class LoginPage {
  elements = {
    loginLogo: () => cy.get('.login_logo'),
    usernameInput: () => cy.get('[data-test="username"]'),
    passwordInput: () => cy.get('[data-test="password"]'),
    loginButton: () => cy.get('[data-test="login-button"]'),
    errorMessage: () => cy.get('[data-test="error"]'),
  };

  visit() {
    cy.visit('/');
    this.elements.loginLogo().should('be.visible');
  }

  /**
   * Submit the login form. Username/password are optional so the same
   * method can drive the required-field validation scenarios.
   */
  login(username, password) {
    if (username) {
      this.elements.usernameInput().clear().type(username);
    }
    if (password) {
      this.elements.passwordInput().clear().type(password, { log: false });
    }
    this.elements.loginButton().click();
  }

  assertErrorMessage(message) {
    this.elements.errorMessage().should('be.visible').and('have.text', message);
  }

  assertOnLoginPage() {
    cy.location('pathname').should('eq', '/');
    this.elements.loginButton().should('be.visible');
  }
}

export default new LoginPage();
