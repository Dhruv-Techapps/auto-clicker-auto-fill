import nx from '@nx/eslint-plugin';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/build', '**/.react-router', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*']
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      'react-hooks': reactHooks
    },
    rules: {
      // Nx rules
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
      ],

      // Core ESLint rules
      'prefer-const': 'warn',
      'no-unused-vars': 'off', // Turn off core rule in favor of TypeScript version

      // TypeScript recommended rules
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // React recommended rules
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // Using TypeScript instead

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React performance suggestions
      'react/jsx-no-bind': 'warn',
      'react/jsx-no-leaked-render': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    rules: {}
  }
];
