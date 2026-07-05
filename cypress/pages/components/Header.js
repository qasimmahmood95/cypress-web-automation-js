/**
 * The header (and its burger-menu sidebar) is shared by every page behind
 * login, so it lives in a component object rather than being duplicated
 * across page objects.
 */
class Header {
  elements = {
    pageTitle: () => cy.get('[data-test="title"]'),
    cartLink: () => cy.get('[data-test="shopping-cart-link"]'),
    cartBadge: () => cy.get('[data-test="shopping-cart-badge"]'),
    menuButton: () => cy.get('#react-burger-menu-btn'),
    logoutLink: () => cy.get('[data-test="logout-sidebar-link"]'),
    resetAppStateLink: () => cy.get('[data-test="reset-sidebar-link"]'),
  };

  openCart() {
    this.elements.cartLink().click();
  }

  openMenu() {
    this.elements.menuButton().click();
  }

  logout() {
    this.openMenu();
    this.elements.logoutLink().click();
  }

  resetAppState() {
    this.openMenu();
    this.elements.resetAppStateLink().click();
  }

  assertPageTitle(title) {
    this.elements.pageTitle().should('be.visible').and('have.text', title);
  }

  /** The badge is removed from the DOM entirely when the cart is empty. */
  assertCartCount(count) {
    if (count === 0) {
      this.elements.cartBadge().should('not.exist');
    } else {
      this.elements.cartBadge().should('be.visible').and('have.text', String(count));
    }
  }
}

export default new Header();
