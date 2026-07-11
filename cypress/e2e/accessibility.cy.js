import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import baseline from '../fixtures/a11y-baseline.json';

/**
 * Accessibility regression gate. SauceDemo is a third-party site with
 * known, documented axe violations (see fixtures/a11y-baseline.json), so
 * these tests fail only on violations *beyond* that baseline — the same
 * pattern a real team uses to stop the bleeding without a big-bang fix.
 */
const assertNoNewViolations = (page) => {
  cy.checkA11y(
    null,
    null,
    (violations) => {
      const known = baseline[page] || [];
      const unexpected = violations
        .filter((violation) => !known.includes(violation.id))
        .map((violation) => `${violation.id} (${violation.impact}): ${violation.help}`);
      expect(unexpected, `axe violations beyond the documented baseline on ${page}`).to.be.empty;
    },
    true // skipFailures: the callback above owns the pass/fail decision
  );
};

describe('Accessibility', () => {
  it('login page introduces no new axe violations', () => {
    LoginPage.visit();
    cy.injectAxe();
    assertNoNewViolations('login');
  });

  it('inventory page introduces no new axe violations', () => {
    cy.loginAsStandardUser();
    ProductsPage.visit();
    cy.injectAxe();
    assertNoNewViolations('inventory');
  });
});
