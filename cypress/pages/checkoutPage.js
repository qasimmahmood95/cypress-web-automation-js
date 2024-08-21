export default class checkoutPage {
  constructor() {
    this.checkoutButton = () => cy.get('[data-test="checkout"]');
    this.firstNameTextField = () => cy.get('[data-test="firstName"]');
    this.lastNameTextField = () => cy.get('[data-test="lastName"]');
    this.postalCodeTextField = () => cy.get('[data-test="postalCode"]');
    this.continueButton = () => cy.get('[data-test="continue"]');
    this.paymentInfo = () => cy.get('[data-test="payment-info-label"]');
    this.shippingInfo = () => cy.get('[data-test="shipping-info-label"]');
    this.totalInfo = () => cy.get('[data-test="total-info-label"]');
    this.finishButton = () => cy.get('[data-test="finish"]');
    this.orderConfirmation = () => cy.get('[data-test="complete-header"]');
  }

  clickCheckoutButton() {
    this.checkoutButton().click();
  }

  enterFirstName(firstName) {
    this.firstNameTextField().type(firstName);
  }

  enterLastName(lastName) {
    this.lastNameTextField().type(lastName);
  }

  enterPostalCode(postalCode) {
    this.postalCodeTextField().type(postalCode);
  }

  clickContinueButton() {
    this.continueButton().click();
  }

  checkCheckoutInfoPage() {
    this.paymentInfo().should('be.visible');
    this.shippingInfo().should('be.visible');
    this.totalInfo().should('be.visible');
  }

  clickFinishButton() {
    this.finishButton().click();
  }

  checkOrderConfirmation() {
    this.orderConfirmation().should('be.visible');
    this.orderConfirmation().invoke('text').should('include', 'Thank you for your order!');
  }
}
