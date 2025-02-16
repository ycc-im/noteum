import baseConfig from '../../.eslintrc.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    parserOptions: {
      project: './tsconfig.json',
    },
  },
];
