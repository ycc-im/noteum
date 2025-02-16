import baseConfig from '../../eslint.config.js';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    parserOptions: {
      project: './tsconfig.json',
    },
  },
];
