import playwright from 'eslint-plugin-playwright';
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {}
  },
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {}
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**/*.ts', 'playwright.config.ts'],
  }
];
