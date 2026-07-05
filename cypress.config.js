const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'SauceDemo E2E Test Report',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  viewportWidth: 1280,
  viewportHeight: 800,
  video: false,
  screenshotOnRunFailure: true,
  retries: {
    // Retry failed tests in headless runs (CI) to absorb transient flake;
    // never retry in interactive mode so failures surface immediately while developing.
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    setupNodeEvents(on) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
