import { parseAmount } from '../support/utils';

/**
 * Covers the three checkout screens: customer information (step one),
 * order overview (step two), and order confirmation.
 */
class CheckoutPage {
  elements = {
    // Step one: customer information
    firstNameInput: () => cy.get('[data-test="firstName"]'),
    lastNameInput: () => cy.get('[data-test="lastName"]'),
    postalCodeInput: () => cy.get('[data-test="postalCode"]'),
    continueButton: () => cy.get('[data-test="continue"]'),
    cancelButton: () => cy.get('[data-test="cancel"]'),
    errorMessage: () => cy.get('[data-test="error"]'),
    // Step two: order overview
    summaryItems: () => cy.get('[data-test="inventory-item"]'),
    subtotalLabel: () => cy.get('[data-test="subtotal-label"]'),
    taxLabel: () => cy.get('[data-test="tax-label"]'),
    totalLabel: () => cy.get('[data-test="total-label"]'),
    finishButton: () => cy.get('[data-test="finish"]'),
    // Confirmation
    completeHeader: () => cy.get('[data-test="complete-header"]'),
    backHomeButton: () => cy.get('[data-test="back-to-products"]'),
  };

  /** Fields are optional so the same method can drive validation scenarios. */
  fillCustomerInfo({ firstName, lastName, postalCode } = {}) {
    if (firstName) {
      this.elements.firstNameInput().clear().type(firstName);
    }
    if (lastName) {
      this.elements.lastNameInput().clear().type(lastName);
    }
    if (postalCode) {
      this.elements.postalCodeInput().clear().type(postalCode);
    }
  }

  continueToOverview() {
    this.elements.continueButton().click();
  }

  cancel() {
    this.elements.cancelButton().click();
  }

  finish() {
    this.elements.finishButton().click();
  }

  backHome() {
    this.elements.backHomeButton().click();
  }

  /** Yields { subtotal, tax, total } from the order overview as numbers. */
  getSummaryTotals() {
    const totals = {};
    this.elements
      .subtotalLabel()
      .invoke('text')
      .then((text) => (totals.subtotal = parseAmount(text)));
    this.elements
      .taxLabel()
      .invoke('text')
      .then((text) => (totals.tax = parseAmount(text)));
    this.elements
      .totalLabel()
      .invoke('text')
      .then((text) => (totals.total = parseAmount(text)));
    // cy.wrap resolves at run time, after the queued reads above have filled `totals`.
    return cy.wrap(totals, { log: false });
  }

  assertSummaryItemCount(count) {
    this.elements.summaryItems().should('have.length', count);
  }

  assertErrorMessage(message) {
    this.elements.errorMessage().should('be.visible').and('have.text', message);
  }

  assertOrderComplete() {
    cy.location('pathname').should('eq', '/checkout-complete.html');
    this.elements
      .completeHeader()
      .should('be.visible')
      .and('have.text', 'Thank you for your order!');
  }
}

export default new CheckoutPage();
