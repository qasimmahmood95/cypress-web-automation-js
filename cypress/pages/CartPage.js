import { productSlug } from '../support/utils';

class CartPage {
  elements = {
    cartList: () => cy.get('[data-test="cart-list"]'),
    cartItems: () => cy.get('[data-test="inventory-item"]'),
    itemByName: (name) => cy.contains('[data-test="inventory-item"]', name),
    removeButton: (name) => cy.get(`[data-test="remove-${productSlug(name)}"]`),
    checkoutButton: () => cy.get('[data-test="checkout"]'),
    continueShoppingButton: () => cy.get('[data-test="continue-shopping"]'),
  };

  visit() {
    // See ProductsPage.visit(): deep links return a 404 status but still
    // serve the app shell.
    cy.visit('/cart.html', { failOnStatusCode: false });
    this.elements.cartList().should('be.visible');
  }

  removeProduct(name) {
    this.elements.removeButton(name).click();
  }

  beginCheckout() {
    this.elements.checkoutButton().click();
  }

  continueShopping() {
    this.elements.continueShoppingButton().click();
  }

  assertProductInCart(name) {
    this.elements.itemByName(name).should('be.visible');
  }

  assertProductNotInCart(name) {
    this.elements.cartList().should('not.contain.text', name);
  }

  assertItemCount(count) {
    if (count === 0) {
      this.elements.cartItems().should('not.exist');
    } else {
      this.elements.cartItems().should('have.length', count);
    }
  }
}

export default new CartPage();
