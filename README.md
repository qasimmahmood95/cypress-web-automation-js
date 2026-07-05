# Cypress Web Automation (JavaScript)

[![CI](https://github.com/qasimmahmood95/cypress-web-automation-js/actions/workflows/ci.yml/badge.svg)](https://github.com/qasimmahmood95/cypress-web-automation-js/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/Cypress-15-17202C?logo=cypress&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-grade end-to-end test framework for the [Sauce Labs demo store](https://www.saucedemo.com), built with Cypress and plain JavaScript. It demonstrates the patterns I use in real projects: a lean Page Object Model, session-cached authentication, retry-safe assertions, HTML reporting, and a CI pipeline that runs the full suite on every push.

## Highlights

- **Page Object Model, done lightly.** Each page exports a singleton with an `elements` map of locator factories and small, intention-revealing methods (`addProductToCart(name)`, `fillCustomerInfo(customer)`). Shared UI (header, cart badge, burger menu) lives in a reusable component object instead of being copy-pasted between pages.
- **Session-cached login.** Tests authenticate through a `cy.login()` custom command built on [`cy.session()`](https://docs.cypress.io/api/commands/session) with `cacheAcrossSpecs`, so the UI login runs once and every other test restores the cookie snapshot — faster runs, isolated state, and a clean cart guaranteed at the start of each test. The login specs still exercise the real form.
- **Stable, semantic selectors.** Every locator targets the app's `data-test` attributes, with product names converted to selector slugs in one utility — no brittle CSS chains or XPath.
- **Meaningful assertions.** The checkout suite verifies the order total math against prices scraped from the inventory page; the sorting suite asserts real order inside `.should()` callbacks so the checks ride Cypress's retry loop instead of racing the re-render.
- **CI you can read.** GitHub Actions lints, format-checks, then runs the whole suite in Chrome; an HTML report (with embedded failure screenshots) is uploaded as an artifact on every run.

## Test coverage

| Spec             | Scenarios                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login.cy.js`    | Successful login, locked-out user, invalid credentials, required username/password validation, logout                                                                                       |
| `products.cy.js` | Add/remove from inventory list and details page, cart badge counts, sorting by name and price in both directions, a characterisation test pinning down `problem_user`'s broken-image defect |
| `cart.cy.js`     | Cart contents after adding, removing items from the cart, reset app state clears the cart, cart persistence when continuing shopping                                                        |
| `checkout.cy.js` | Full purchase flow with subtotal/tax/total verification, required-field validation for each field, cancel flow, return to inventory                                                         |

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone https://github.com/qasimmahmood95/cypress-web-automation-js.git
cd cypress-web-automation-js
npm ci
```

Run the suite headlessly (Electron by default):

```bash
npm test
```

Or interactively with the Cypress runner:

```bash
npm run cy:open
```

### All scripts

| Script                 | What it does                        |
| ---------------------- | ----------------------------------- |
| `npm test`             | Run the full suite headlessly       |
| `npm run test:chrome`  | Run the suite in Chrome             |
| `npm run test:firefox` | Run the suite in Firefox            |
| `npm run cy:open`      | Open the interactive Cypress runner |
| `npm run lint`         | Lint with ESLint (flat config)      |
| `npm run lint:fix`     | Lint and auto-fix                   |
| `npm run format`       | Format the codebase with Prettier   |
| `npm run format:check` | Verify formatting without writing   |

After a headless run, an HTML report is generated at `cypress/reports/index.html`.

> The credentials in `cypress/fixtures/users.json` are the public demo accounts that saucedemo.com documents on its own login page — nothing secret lives in this repo.

## Project structure

```
├── .github/workflows/ci.yml     # Lint + E2E pipeline
├── cypress.config.js            # Base URL, retries, viewport, reporter
├── cypress
│   ├── e2e                      # Specs, grouped by feature
│   │   ├── login.cy.js
│   │   ├── products.cy.js
│   │   ├── cart.cy.js
│   │   └── checkout.cy.js
│   ├── fixtures                 # Test data (users, checkout customer info)
│   ├── pages                    # Page objects (singletons)
│   │   ├── components/Header.js # Shared header/sidebar component object
│   │   ├── LoginPage.js
│   │   ├── ProductsPage.js
│   │   ├── ProductDetailsPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   └── support
│       ├── commands.js          # cy.login() via cy.session()
│       ├── e2e.js               # Global setup (reporter, commands)
│       └── utils.js             # Selector slugs, money parsing
└── eslint.config.mjs            # ESLint flat config + Cypress plugin
```

## Design decisions

**Why singleton page objects instead of `new LoginPage()` in every test?**
The page objects hold no per-test state — just locators and actions — so a shared instance keeps specs terse and makes the import the only ceremony.

**Why locator factories (`() => cy.get(...)`) instead of stored elements?**
Cypress re-queries the DOM on every call, so factories stay fresh across re-renders and play nicely with retry-ability. Storing the result of `cy.get()` is a classic staleness trap.

**Why `cy.session()` rather than logging in through the UI in every test?**
One UI login per user per run is enough to prove the form works (and the login spec covers it explicitly). Everything else restores a cached session: the suite gets faster, and because the snapshot is taken with an empty cart, every test starts from a known-clean state.

**Why retries in CI but not locally?**
`retries: { runMode: 2, openMode: 0 }` absorbs transient network flake against a live public site in CI, while keeping failures loud and immediate during local development. Genuine failures still fail — three times in a row.

**Why no arbitrary waits?**
There is not a single `cy.wait(ms)` in the suite. Every step either asserts visibility/URL state before acting or relies on Cypress's built-in retry-until-actionable behaviour — the single biggest lever against flaky E2E suites.

**Why test a user that is broken on purpose?**
SauceDemo ships `problem_user` with deliberate defects. The suite includes a characterisation test that detects one of them (every product renders the same 404 image) — automation that only ever walks the happy path proves very little about its ability to catch a regression.

## CI pipeline

Every push and pull request runs two jobs (plus a weekly scheduled run, since the suite targets a live third-party site that can change while the repo is quiet):

1. **Lint & format check** — ESLint (with `eslint-plugin-cypress`) and Prettier in check mode. The Cypress binary download is skipped here for speed.
2. **Cypress E2E (Chrome)** — the full suite via the official `cypress-io/github-action`, gated on lint passing. The mochawesome HTML report is uploaded as an artifact on every run, and failure screenshots are attached when something breaks.

## License

[MIT](LICENSE) © Qasim Mahmood
