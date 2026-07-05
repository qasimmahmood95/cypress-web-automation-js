import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import Header from '../pages/components/Header';

const BACKPACK = 'Sauce Labs Backpack';
const ONESIE = 'Sauce Labs Onesie';

describe('Cart', () => {
  beforeEach(() => {
    cy.loginAsStandardUser();
    ProductsPage.visit();
  });

  it('shows added products in the cart', () => {
    ProductsPage.addProductToCart(BACKPACK);
    ProductsPage.addProductToCart(ONESIE);
    Header.openCart();

    cy.location('pathname').should('eq', '/cart.html');
    CartPage.assertItemCount(2);
    CartPage.assertProductInCart(BACKPACK);
    CartPage.assertProductInCart(ONESIE);
  });

  it('removes a product from the cart', () => {
    ProductsPage.addProductToCart(BACKPACK);
    ProductsPage.addProductToCart(ONESIE);
    Header.openCart();

    CartPage.removeProduct(BACKPACK);

    CartPage.assertItemCount(1);
    CartPage.assertProductNotInCart(BACKPACK);
    CartPage.assertProductInCart(ONESIE);
    Header.assertCartCount(1);
  });

  it('clears the cart when resetting app state', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.assertCartCount(1);

    Header.resetAppState();

    Header.assertCartCount(0);
  });

  it('keeps the cart contents when continuing shopping', () => {
    ProductsPage.addProductToCart(BACKPACK);
    Header.openCart();

    CartPage.continueShopping();

    cy.location('pathname').should('eq', '/inventory.html');
    Header.assertCartCount(1);
    ProductsPage.assertProductAddedToCart(BACKPACK);
  });
});
