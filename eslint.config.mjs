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
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ],
          allowCircularSelfDependency: true
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    // Override or add rules here
    rules: {}
  }
];
