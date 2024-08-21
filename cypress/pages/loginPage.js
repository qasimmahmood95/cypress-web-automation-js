export default class loginPage {
  constructor() {
    this.swagLabsLoginLogo = () => cy.get('[class="login_logo"]');
    this.swagLabsLogo = () => cy.get('[class="app_logo"]');
    this.usernameField = () => cy.get('[data-test="username"]');
    this.passwordField = () => cy.get('[data-test="password"]');
    this.loginButton = () => cy.get('[data-test="login-button"]');
    this.productsTitle = () => cy.get('[data-test="title"]');
    this.loginError = () => cy.get('[data-test="error"]');
    this.openSidebarMenuButton = () => cy.get('[id="react-burger-menu-btn"]');
    this.resetAppStateButton = () => cy.get('[data-test="reset-sidebar-link"]');
    this.logoutButton = () => cy.get('[data-test="logout-sidebar-link"]');
  }

  async login(username, password) {
    this.checkSwagLabsLoginLogo();
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLoginButton();
    this.checkSwagLabsLogo();
  }

  enterUsername(username) {
    this.usernameField().type(username);
  }

  enterPassword(password) {
    this.passwordField().type(password);
  }

  clickLoginButton() {
    this.loginButton().click();
  }

  clickOpenSidebarMenuButton() {
    this.openSidebarMenuButton().click();
  }

  clickResetAppStateButton() {
    this.resetAppStateButton().click();
  }

  clickLogoutButton() {
    this.logoutButton().click();
  }

  checkSwagLabsLoginLogo() {
    this.swagLabsLoginLogo().should('be.visible');
  }

  checkSwagLabsLogo() {
    this.swagLabsLogo().should('be.visible');
  }

  checkProductsTitle() {
    this.productsTitle().should('be.visible');
  }

  checkLoginError() {
    this.loginError().should('be.visible');
    this.loginError().should('have.text', 'Epic sadface: Sorry, this user has been locked out.');
  }
}
