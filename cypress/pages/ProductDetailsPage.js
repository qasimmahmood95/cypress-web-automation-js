class ProductDetailsPage {
  elements = {
    productName: () => cy.get('[data-test="inventory-item-name"]'),
    addToCartButton: () => cy.get('[data-test="add-to-cart"]'),
    removeButton: () => cy.get('[data-test="remove"]'),
    backToProductsButton: () => cy.get('[data-test="back-to-products"]'),
  };

  addToCart() {
    this.elements.addToCartButton().click();
  }

  removeFromCart() {
    this.elements.removeButton().click();
  }

  backToProducts() {
    this.elements.backToProductsButton().click();
  }

  assertProductName(name) {
    this.elements.productName().should('be.visible').and('have.text', name);
  }
}

export default new ProductDetailsPage();
