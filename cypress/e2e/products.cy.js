import loginPage from '../pages/loginPage.js';
import productsPage from '../pages/productsPage.js';
import user from '../fixtures/user.json';

describe('Product Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Standard user can add items to the basket and remove them', () => {
    const login = new loginPage();
    const products = new productsPage();

    login.login(user.username, user.password);

    products.clickBikeLightTitle();
    products.clickAddToCartButton();
    products.checkShoppingCartHasItems(1);
    products.clickRemoveButton();
    products.checkShoppingCartHasItems(0);
    products.clickBackToProductsButton();

    products.clickOnesieAddToCartButton();
    products.checkOnesieRemoveButton();
    products.checkShoppingCartHasItems(1);
    products.clickBikeLightAddToCartButton();
    products.checkBikeLightRemoveButton();

    products.clickShoppingCartButton();
    products.checkTitle('Your Cart');

    products.clickOnesieRemoveButton();
    products.checkShoppingCartHasItems(1);
    products.clickBikeLightRemoveButton();
    products.checkShoppingCartHasItems(0);
  });
});
