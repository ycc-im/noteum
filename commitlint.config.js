module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['server', 'web', 'ui', 'shared'] // 允许的作用域列表
    ]
  }
}