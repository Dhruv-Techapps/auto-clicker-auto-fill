// eslint.config.ts
import nx from '@nx/eslint-plugin';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import functional from 'eslint-plugin-functional';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import unicornPlugin from 'eslint-plugin-unicorn';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': ts,
      functional,
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      unicorn: unicornPlugin
    },
    rules: {
      // React
      ...reactPlugin.configs['jsx-runtime'].rules,

      // React Hooks
      ...hooksPlugin.configs.recommended.rules,

      // TypeScript Recommended
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs['recommended'].rules,

      // Functional Plugin
      ...functional.configs['recommended'].rules,

      // JSX Accessibility
      ...jsxA11y.configs.recommended.rules,

      // Overrides and Custom Rules
      'prefer-const': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // React Specific
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Performance
      'react/jsx-no-bind': 'warn',
      'react/jsx-no-leaked-render': 'warn',

      'import/order': ['warn', { groups: ['builtin', 'external', 'internal'] }],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'warn',

      'unicorn/prefer-query-selector': 'warn',
      'unicorn/no-array-for-each': 'warn',
      'unicorn/filename-case': ['warn', { case: 'kebabCase' }]
    }
  },

  // Nx Base Configs (already in flat config style)
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // Additional rule overrides for broader file scope
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$', '@acf-options-page/**'],
          depConstraints: [
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:core']
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:core', 'scope:shared']
            },
            {
              sourceTag: 'scope:acf',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:core', 'scope:acf']
            },
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['*']
            },
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ],
          allowCircularSelfDependency: true
        }
      ]
    }
  },

  // Ignore patterns
  {
    ignores: ['**/dist', '**/build', '**/.react-router', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*']
  }
];
