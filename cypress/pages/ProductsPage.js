import { productSlug, parseAmount } from '../support/utils';

class ProductsPage {
  elements = {
    inventoryList: () => cy.get('[data-test="inventory-list"]'),
    itemNames: () => cy.get('[data-test="inventory-item-name"]'),
    itemPrices: () => cy.get('[data-test="inventory-item-price"]'),
    sortSelect: () => cy.get('[data-test="product-sort-container"]'),
    itemByName: (name) => cy.contains('[data-test="inventory-item"]', name),
    addToCartButton: (name) => cy.get(`[data-test="add-to-cart-${productSlug(name)}"]`),
    removeButton: (name) => cy.get(`[data-test="remove-${productSlug(name)}"]`),
  };

  visit() {
    cy.visit('/inventory.html');
    this.elements.inventoryList().should('be.visible');
  }

  addProductToCart(name) {
    this.elements.addToCartButton(name).click();
  }

  removeProductFromCart(name) {
    this.elements.removeButton(name).click();
  }

  openProductDetails(name) {
    this.elements.itemByName(name).find('[data-test="inventory-item-name"]').click();
  }

  /** @param option one of: 'az' | 'za' | 'lohi' | 'hilo' */
  sortBy(option) {
    this.elements.sortSelect().select(option);
  }

  /** Yields the listed price of a product as a number, e.g. 29.99. */
  getProductPrice(name) {
    return this.elements
      .itemByName(name)
      .find('[data-test="inventory-item-price"]')
      .invoke('text')
      .then(parseAmount);
  }

  /** A product's add-to-cart button turns into a remove button once it is in the cart. */
  assertProductAddedToCart(name) {
    this.elements.removeButton(name).should('be.visible');
  }

  assertProductNotInCart(name) {
    this.elements.addToCartButton(name).should('be.visible');
  }

  /**
   * Sort assertions read the DOM inside a .should() callback so they
   * re-evaluate on Cypress's retry loop while the list re-renders.
   */
  assertNamesSorted(order = 'asc') {
    this.elements.itemNames().should(($els) => {
      const names = [...$els].map((el) => el.innerText);
      // Guard against a vacuous pass on a partial render: a one-item list
      // is always "sorted".
      expect(names, 'more than one product listed').to.have.length.greaterThan(1);
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      if (order === 'desc') {
        sorted.reverse();
      }
      expect(names, `product names sorted ${order}`).to.deep.equal(sorted);
    });
  }

  assertPricesSorted(order = 'asc') {
    this.elements.itemPrices().should(($els) => {
      const prices = [...$els].map((el) => parseAmount(el.innerText));
      expect(prices, 'more than one product listed').to.have.length.greaterThan(1);
      const sorted = [...prices].sort((a, b) => a - b);
      if (order === 'desc') {
        sorted.reverse();
      }
      expect(prices, `product prices sorted ${order}`).to.deep.equal(sorted);
    });
  }
}

export default new ProductsPage();
