import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import Header from '../pages/components/Header';
import checkout from '../fixtures/checkout.json';

const { customer } = checkout;

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

describe('Checkout', () => {
  beforeEach(() => {
    cy.loginAsStandardUser();
    ProductsPage.visit();
  });

  it('completes an order and charges the right total', () => {
    // Capture the listed prices up front so the order overview can be
    // verified against them, not against hard-coded values.
    ProductsPage.getProductPrice(BACKPACK).as('backpackPrice');
    ProductsPage.getProductPrice(BIKE_LIGHT).as('bikeLightPrice');

    ProductsPage.addProductToCart(BACKPACK);
    ProductsPage.addProductToCart(BIKE_LIGHT);
    Header.openCart();
    CartPage.beginCheckout();

    CheckoutPage.fillCustomerInfo(customer);
    CheckoutPage.continueToOverview();

    cy.location('pathname').should('eq', '/checkout-step-two.html');
    CheckoutPage.assertSummaryItemCount(2);
    CheckoutPage.getSummaryTotals().then(function ({ subtotal, tax, total }) {
      expect(subtotal, 'subtotal is the sum of item prices').to.be.closeTo(
        this.backpackPrice + this.bikeLightPrice,
        0.005
      );
      expect(tax, 'tax is 8% of the subtotal').to.be.closeTo(subtotal * 0.08, 0.005);
      expect(total, 'total = subtotal + tax').to.be.closeTo(subtotal + tax, 0.005);
    });

    CheckoutPage.finish();
    CheckoutPage.assertOrderComplete();
    Header.assertCartCount(0);
  });

  it('returns to the inventory after completing an order', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.openCart();
    CartPage.beginCheckout();
    CheckoutPage.fillCustomerInfo(customer);
    CheckoutPage.continueToOverview();
    CheckoutPage.finish();
    CheckoutPage.assertOrderComplete();

    CheckoutPage.backHome();

    cy.location('pathname').should('eq', '/inventory.html');
    Header.assertPageTitle('Products');
  });

  it('requires a first name', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.openCart();
    CartPage.beginCheckout();

    CheckoutPage.fillCustomerInfo({ ...customer, firstName: '' });
    CheckoutPage.continueToOverview();

    CheckoutPage.assertErrorMessage('Error: First Name is required');
  });

  it('requires a last name', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.openCart();
    CartPage.beginCheckout();

    CheckoutPage.fillCustomerInfo({ ...customer, lastName: '' });
    CheckoutPage.continueToOverview();

    CheckoutPage.assertErrorMessage('Error: Last Name is required');
  });

  it('requires a postal code', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.openCart();
    CartPage.beginCheckout();

    CheckoutPage.fillCustomerInfo({ ...customer, postalCode: '' });
    CheckoutPage.continueToOverview();

    CheckoutPage.assertErrorMessage('Error: Postal Code is required');
  });

  it('cancelling customer information returns to the cart', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.openCart();
    CartPage.beginCheckout();

    CheckoutPage.cancel();

    cy.location('pathname').should('eq', '/cart.html');
    CartPage.assertProductInCart(BACKPACK);
  });
});
