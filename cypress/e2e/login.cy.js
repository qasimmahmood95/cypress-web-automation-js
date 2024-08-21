import loginPage from '../pages/loginPage.js';
import user from '../fixtures/user.json';

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Standard user can login', () => {
    const login = new loginPage();

    login.checkSwagLabsLoginLogo();
    login.usernameField().type(user.username);
    login.passwordField().type(user.password);
    login.clickLoginButton();
    login.checkProductsTitle();
    login.checkSwagLabsLogo();
    login.clickOpenSidebarMenuButton();
    login.clickResetAppStateButton();
    login.clickLogoutButton();
  });

  it('Locked out user cannot login', () => {
    const login = new loginPage();

    login.checkSwagLabsLoginLogo();
    login.usernameField().type(user.locked_username);
    login.passwordField().type(user.password);
    login.clickLoginButton();
    login.checkLoginError();
  });
});
