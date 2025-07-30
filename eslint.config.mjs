// eslint.config.ts
import nx from '@nx/eslint-plugin';

export default [
  // Nx Base Configs (already in flat config style)
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...nx.configs['flat/react'],
  ...nx.configs['flat/react-base'],
  ...nx.configs['flat/react-typescript'],
  ...nx.configs['flat/react-jsx'],

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
    ignores: ['**/dist', '**/out-tsx', '**/build', '**/.react-router', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*']
  }
];
