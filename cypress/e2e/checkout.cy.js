import loginPage from '../pages/loginPage.js';
import productsPage from '../pages/productsPage.js';
import checkoutPage from '../pages/checkoutPage.js';
import user from '../fixtures/user.json';

describe('Checkout Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('Standard user can add an item to the basket and checkout', () => {
    const login = new loginPage();
    const products = new productsPage();
    const checkout = new checkoutPage();

    login.login(user.username, user.password);

    products.clickOnesieAddToCartButton();
    products.checkShoppingCartHasItems(1);
    products.clickShoppingCartButton();
    products.checkTitle('Your Cart');

    checkout.clickCheckoutButton();
    checkout.enterFirstName('Testing');
    checkout.enterLastName('Tester');
    checkout.enterPostalCode('TE5');
    checkout.clickContinueButton();

    checkout.checkCheckoutInfoPage();
    checkout.clickFinishButton();
    checkout.checkOrderConfirmation();
  });
});
