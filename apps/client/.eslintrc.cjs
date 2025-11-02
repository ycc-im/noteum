module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      // React 组件和 hooks - PascalCase
      {
        selector: ['variable', 'function'],
        format: ['PascalCase'],
        filter: {
          regex: '^[A-Z]',
          match: true,
        },
      },
      // 常规变量和函数 - camelCase
      {
        selector: ['variable', 'function'],
        format: ['camelCase'],
        filter: {
          regex: '^[A-Z]',
          match: false,
        },
      },
      // 类型和接口 - PascalCase
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      // 枚举成员 - UPPER_CASE
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
      },
      // 参数和属性 - camelCase (允许前导下划线)
      {
        selector: ['parameter', 'property'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      // 方法 - camelCase
      {
        selector: 'method',
        format: ['camelCase'],
      },
      // 全局常量 - UPPER_CASE
      {
        selector: 'variable',
        modifiers: ['global'],
        format: ['UPPER_CASE'],
      },
      // 导出的常量 - UPPER_CASE
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['UPPER_CASE', 'PascalCase', 'camelCase'],
      },
    ],
  },
}
