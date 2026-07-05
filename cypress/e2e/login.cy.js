import LoginPage from '../pages/LoginPage';
import Header from '../pages/components/Header';
import users from '../fixtures/users.json';

// These specs exercise the login UI itself, so they deliberately log in
// through the form instead of using the session-cached cy.login() command.
describe('Login', () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it('logs in a standard user and lands on the inventory page', () => {
    LoginPage.login(users.standard.username, users.standard.password);

    cy.location('pathname').should('eq', '/inventory.html');
    Header.assertPageTitle('Products');
  });

  it('shows an error for a locked out user', () => {
    LoginPage.login(users.locked.username, users.locked.password);

    LoginPage.assertErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  it('shows an error for invalid credentials', () => {
    LoginPage.login(users.standard.username, 'wrong_password');

    LoginPage.assertErrorMessage(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  it('requires a username', () => {
    LoginPage.login('', users.standard.password);

    LoginPage.assertErrorMessage('Epic sadface: Username is required');
  });

  it('requires a password', () => {
    LoginPage.login(users.standard.username, '');

    LoginPage.assertErrorMessage('Epic sadface: Password is required');
  });

  it('logs out from the sidebar menu', () => {
    LoginPage.login(users.standard.username, users.standard.password);
    cy.location('pathname').should('eq', '/inventory.html');

    Header.logout();

    LoginPage.assertOnLoginPage();
  });
});
