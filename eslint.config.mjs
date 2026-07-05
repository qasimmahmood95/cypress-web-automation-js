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
  {
    // The plugin's recommended config ships unscoped (and defines cy,
    // describe, window, ... globally), so constrain it to test code —
    // Node-side files keep real no-undef coverage.
    files: ['cypress/**/*.js'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      globals: {
        ...cypress.configs.recommended.languageOptions?.globals,
        ...globals.browser,
      },
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
