import playwright from 'eslint-plugin-playwright';
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  playwright.configs['flat/recommended'],
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
  }
];
