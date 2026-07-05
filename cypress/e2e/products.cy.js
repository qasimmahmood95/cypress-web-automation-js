import ProductsPage from '../pages/ProductsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import Header from '../pages/components/Header';
import users from '../fixtures/users.json';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

describe('Products', () => {
  beforeEach(() => {
    cy.loginAsStandardUser();
    ProductsPage.visit();
  });

  it('adds and removes products from the inventory list', () => {
    ProductsPage.addProductToCart(BACKPACK);
    ProductsPage.assertProductAddedToCart(BACKPACK);
    Header.assertCartCount(1);

    ProductsPage.addProductToCart(BIKE_LIGHT);
    ProductsPage.assertProductAddedToCart(BIKE_LIGHT);
    Header.assertCartCount(2);

    ProductsPage.removeProductFromCart(BACKPACK);
    ProductsPage.assertProductNotInCart(BACKPACK);
    Header.assertCartCount(1);

    ProductsPage.removeProductFromCart(BIKE_LIGHT);
    ProductsPage.assertProductNotInCart(BIKE_LIGHT);
    Header.assertCartCount(0);
  });

  it('adds a product from its details page', () => {
    ProductsPage.openProductDetails(BACKPACK);
    ProductDetailsPage.assertProductName(BACKPACK);

    ProductDetailsPage.addToCart();
    Header.assertCartCount(1);

    ProductDetailsPage.backToProducts();
    ProductsPage.assertProductAddedToCart(BACKPACK);
  });

  it('removes a product from its details page', () => {
    ProductsPage.addProductToCart(BIKE_LIGHT);
    Header.assertCartCount(1);

    ProductsPage.openProductDetails(BIKE_LIGHT);
    ProductDetailsPage.removeFromCart();

    Header.assertCartCount(0);
    ProductDetailsPage.backToProducts();
    ProductsPage.assertProductNotInCart(BIKE_LIGHT);
  });

  it('sorts products by name (A to Z)', () => {
    // 'az' is the default order, so switch away first — otherwise this
    // test could never fail, even with the sort handler broken.
    ProductsPage.sortBy('za');
    ProductsPage.assertNamesSorted('desc');

    ProductsPage.sortBy('az');
    ProductsPage.assertNamesSorted('asc');
  });

  it('sorts products by name (Z to A)', () => {
    ProductsPage.sortBy('za');
    ProductsPage.assertNamesSorted('desc');
  });

  it('sorts products by price (low to high)', () => {
    ProductsPage.sortBy('lohi');
    ProductsPage.assertPricesSorted('asc');
  });

  it('sorts products by price (high to low)', () => {
    ProductsPage.sortBy('hilo');
    ProductsPage.assertPricesSorted('desc');
  });
});

// SauceDemo ships deliberately broken personas. This characterisation test
// pins down problem_user's known defect — every product renders the same
// 404 dog image — proving the suite can detect visual data bugs, not just
// walk the happy path.
describe('Products (problem user)', () => {
  it('detects the broken product images shown to the problem user', () => {
    cy.login(users.problem.username, users.problem.password);
    ProductsPage.visit();

    cy.get('[data-test="inventory-item"] img').should(($imgs) => {
      const sources = [...$imgs].map((img) => img.getAttribute('src'));
      expect(sources, 'more than one product listed').to.have.length.greaterThan(1);
      sources.forEach((src) => {
        expect(src, 'every product shows the broken 404 image').to.include('sl-404');
      });
    });
  });
});
