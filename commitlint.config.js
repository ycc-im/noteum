module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复 bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码执行）
        'refactor', // 重构（既不是新功能也不是 bug 修复）
        'perf', // 性能优化
        'test', // 添加测试
        'build', // 构建系统或外部依赖变更
        'ci', // CI 配置文件和脚本变更
        'chore', // 其他变更
        'revert', // 撤销之前的提交
      ],
    ],
    'scope-enum': [
      2,
      'always',
      ['core', 'ui', 'server', 'utils', 'web', 'deps', 'release', 'common'],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
}
