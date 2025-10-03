module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: [
    'node_modules/',
    'packages/*/dist',
    'packages/*/build',
    'apps/*/dist',
    'apps/*/build',
    'apps/*/src-tauri/target',
    '*.config.js',
    '*.config.ts',
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',

    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: ['apps/server/**/*'],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: ['apps/web/**/*', 'apps/desktop/**/*'],
      env: {
        browser: true,
        node: false,
      },
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      plugins: ['react', 'react-hooks'],
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
};