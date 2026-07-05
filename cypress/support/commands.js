import LoginPage from '../pages/LoginPage';
import users from '../fixtures/users.json';

/**
 * Log in through the UI once per user, then cache and restore the session
 * (cookies + storage) for every subsequent test — including across spec files.
 * The cached snapshot is taken with an empty cart, so each restore also
 * guarantees a clean cart state.
 *
 * @example cy.login('standard_user', 'secret_sauce');
 */
Cypress.Commands.add('login', (username, password) => {
  cy.session(
    ['login', username],
    () => {
      LoginPage.visit();
      LoginPage.login(username, password);
      cy.location('pathname').should('eq', '/inventory.html');
    },
    {
      validate() {
        cy.getCookie('session-username').should('have.property', 'value', username);
      },
      cacheAcrossSpecs: true,
    }
  );
});

/**
 * Convenience wrapper for the most common case: a cached login as the
 * standard demo user.
 *
 * @example cy.loginAsStandardUser();
 */
Cypress.Commands.add('loginAsStandardUser', () => {
  cy.login(users.standard.username, users.standard.password);
});
