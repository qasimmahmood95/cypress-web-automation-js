import js from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress/downloads/**',
    ],
  },
  js.configs.recommended,
  cypress.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // Keep formatting concerns out of ESLint; Prettier owns them.
  prettier,
];
