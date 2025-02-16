import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const commonConfig = {
  languageOptions: {
    globals: {
      console: true,
      process: true,
      require: true,
      exports: true,
      module: true,
      __dirname: true,
      __filename: true,
    },
  },
  ignores: ['**/dist/**'],
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...typescript.configs.recommended.rules,
    },
  },
];
