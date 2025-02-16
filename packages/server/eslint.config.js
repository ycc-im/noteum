import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
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
  },
];
