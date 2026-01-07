import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/build', '**/.react-router', '**/vite.config.*.timestamp*', '**/vitest.config.*.timestamp*']
  },
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
              sourceTag: 'domain:acf-extension',
              onlyDependOnLibsWithTags: ['domain:acf-extension', 'domain:core-common', 'scope:shared', 'scope:acf']
            },
            {
              sourceTag: 'domain:acf-options-page',
              onlyDependOnLibsWithTags: ['domain:acf-options-page', 'scope:shared', 'scope:acf', 'domain:core-common', 'domain:core-service']
            },
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ],
          allowCircularSelfDependency: true
        }
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface']
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {}
  }
];
