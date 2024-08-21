export default class productsPage {
  constructor() {
    this.addToCartButton = () => cy.get('[data-test="add-to-cart"]');
    this.removeButton = () => cy.get('[data-test="remove"]');
    this.backToProductsButton = () => cy.get('[data-test="back-to-products"]');
    this.shoppingCartButton = () => cy.get('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = () => cy.get('[data-test="shopping-cart-badge"]');
    this.bikeLightTitle = () => cy.get('[data-test="item-0-title-link"]');
    this.onesieAddToCartButton = () => cy.get('[data-test="add-to-cart-sauce-labs-onesie"]');
    this.onesieRemoveButton = () => cy.get('[data-test="remove-sauce-labs-onesie"]');
    this.bikeLightRemoveButton = () => cy.get('[data-test="remove-sauce-labs-bike-light"]');
    this.bikeLightAddToCartButton = () => cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.title = () => cy.get('[data-test="title"]');
  }

  clickShoppingCartButton() {
    this.shoppingCartButton().click();
  }

  clickAddToCartButton() {
    this.addToCartButton().click();
  }

  clickRemoveButton() {
    this.removeButton().click();
  }

  clickBackToProductsButton() {
    this.backToProductsButton().click();
  }

  clickBikeLightTitle() {
    this.bikeLightTitle().click();
  }

  clickOnesieAddToCartButton() {
    this.onesieAddToCartButton().click();
  }

  checkOnesieRemoveButton() {
    this.onesieRemoveButton().should('be.visible');
  }

  clickOnesieRemoveButton() {
    this.onesieRemoveButton().click();
  }

  clickBikeLightAddToCartButton() {
    this.bikeLightAddToCartButton().click();
  }

  checkBikeLightRemoveButton() {
    this.bikeLightRemoveButton().should('be.visible');
  }

  clickBikeLightRemoveButton() {
    this.bikeLightRemoveButton().click();
  }

  checkTitle(title) {
    this.title().should('be.visible');
    this.title().invoke('text').should('include', title);
  }

  checkShoppingCartHasItems(itemAmount) {
    if (itemAmount == 0) {
      this.shoppingCartBadge().should('not.exist');
    } else {
      const string = itemAmount.toString();
      this.shoppingCartBadge().should('be.visible');
      this.shoppingCartBadge().invoke('text').should('include', string);
    }
  }
}
