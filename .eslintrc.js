module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:fsd/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'fsd'],
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
    '.next/',
    'out/',
    '.storybook/',
    'storybook-static/',
    'coverage/',
    'test-results/',
    'playwright-report/',
    '.cache/',
    '.vite/',
    '.eslintcache',
    '.DS_Store',
    'package-lock.json',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    // Formatting rules (replacing Prettier)
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'space-infix-ops': 'error',
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'max-len': ['warn', { code: 120, ignoreComments: true, ignoreUrls: true }],

    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/prop-types': 'off', // Using TypeScript for prop types
    'react/no-unescaped-entities': 'warn',
    'no-useless-escape': 'warn',
    'no-useless-catch': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/features/*/api.ts'],
      rules: {
        'fsd/enforce-api-contracts': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
      },
    },
    {
      files: ['**/ui/**/*.tsx', '**/ui/**/*.jsx'],
      rules: {
        'fsd/limit-component-lines': 'warn',
        'fsd/no-literal-style-values': 'error',
        'fsd/no-direct-service-imports': 'error',
      },
    },
    {
      files: ['**/shared/utils/**/*.ts'],
      rules: {
        'fsd/require-pure-function-tests': 'error',
      },
    },
    {
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'fsd/limit-component-lines': 'off',
        'fsd/no-direct-service-imports': 'off',
      },
    },
    {
      files: ['**/routes/**/*.tsx'],
      rules: {
        'fsd/enforce-fsd-layer-boundaries': 'warn',
      },
    },
    {
      // Node.js files - allow CommonJS and relax some rules
      files: [
        '*.config.js',
        '*.config.ts',
        'jest.setup.js',
        'tools/**/*.js',
        'scripts/**/*.js',
        'eslint-rules/**/*.js',
      ],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'no-undef': 'off',
        'max-len': ['warn', { code: 150 }],
      },
    },
    {
      // Story files - relax some formatting rules
      files: ['**/*.stories.ts', '**/*.stories.tsx'],
      rules: {
        'max-len': ['warn', { code: 150 }],
      },
    },
  ],
};
