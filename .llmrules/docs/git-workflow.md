# Git 工作流规范

## 分支管理

### 分支命名

```
main          - 主分支，生产环境代码
develop       - 开发分支，开发环境代码
feature/*     - 特性分支，用于开发新功能
bugfix/*      - 修复分支，用于修复问题
release/*     - 发布分支，用于版本发布准备
hotfix/*      - 热修复分支，用于生产环境紧急修复
```

### 分支命名规范

```
feature/[scope]-[description]
bugfix/[scope]-[description]
release/v[version]
hotfix/[scope]-[description]

示例：
feature/auth-google-login
bugfix/ui-button-alignment
release/v1.2.0
hotfix/api-memory-leak
```

## 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type 类型

- feat: 新功能
- fix: 修复问题
- docs: 文档变更
- style: 代码格式修改
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- build: 构建相关
- ci: CI/CD相关
- chore: 其他修改

### Scope 范围

- core: 核心库
- ui: UI组件库
- utils: 工具库
- server: 服务端
- web: Web应用
- deps: 依赖相关
- release: 发布相关

### 示例

```
feat(ui): add new Button component

- Add primary and secondary button variants
- Implement click animation
- Add disabled state styling

BREAKING CHANGE: Button props interface has changed
```

## 工作流程

### 1. 功能开发

```bash
# 1. 从 develop 创建特性分支
git checkout develop
git pull origin develop
git checkout -b feature/auth-google-login

# 2. 开发功能并提交
git add .
git commit -m "feat(auth): implement Google OAuth flow"

# 3. 保持分支同步
git fetch origin develop
git rebase origin/develop

# 4. 推送分支
git push origin feature/auth-google-login
```

### 2. 代码审查

1. 创建 Pull Request
   - 标题：符合 commit message 规范
   - 描述：详细说明变更内容
   - 关联相关 Issue

2. 审查清单
   - 代码质量符合规范
   - 测试覆盖充分
   - 文档更新完整
   - 无安全隐患
   - 性能影响可接受

### 3. 合并流程

```bash
# 1. 确保分支最新
git checkout feature/auth-google-login
git fetch origin develop
git rebase origin/develop

# 2. 解决冲突（如果有）
git rebase --continue

# 3. 合并到 develop
git checkout develop
git merge --no-ff feature/auth-google-login

# 4. 推送更新
git push origin develop
```

## 版本发布

### 1. 创建发布分支

```bash
git checkout develop
git checkout -b release/v1.2.0
```

### 2. 版本准备

1. 更新版本号
2. 生成更新日志
3. 执行测试
4. 更新文档

### 3. 合并到主分支

```bash
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git push origin main --tags
```

## 紧急修复

### 1. 创建热修复分支

```bash
git checkout main
git checkout -b hotfix/api-memory-leak
```

### 2. 修复并测试

```bash
git commit -m "fix(api): resolve memory leak in user service"
```

### 3. 合并到主分支和开发分支

```bash
# 合并到主分支
git checkout main
git merge --no-ff hotfix/api-memory-leak
git tag -a v1.2.1 -m "Hotfix: resolve API memory leak"

# 合并到开发分支
git checkout develop
git merge --no-ff hotfix/api-memory-leak
```

## 最佳实践

1. 经常性同步远程分支
2. 保持提交原子性
3. 编写清晰的提交信息
4. 及时删除已合并的分支
5. 善用 git rebase 保持提交历史整洁
6. 遵循分支命名规范
7. 使用 Pull Request 进行代码审查

## Git Hooks

### pre-commit hook

```bash
#!/bin/sh
npm run lint && npm run test
```

### commit-msg hook

```bash
#!/bin/sh
npx commitlint --edit $1
```

## 常见问题处理

### 1. 提交错误修复

```bash
# 修改最后一次提交
git commit --amend

# 撤销最后一次提交
git reset HEAD~1
```

### 2. 分支清理

```bash
# 删除已合并分支
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# 删除远程已删除分支的本地引用
git fetch -p
```

### 3. 代码回滚

```bash
# 创建回滚提交
git revert <commit-hash>

# 强制回滚到某个提交
git reset --hard <commit-hash>
```

## 工具建议

1. Git GUI 客户端
   - GitKraken
   - SourceTree
   - GitHub Desktop

2. 命令行增强
   - oh-my-zsh git 插件
   - git-flow
   - hub CLI

3. VS Code 插件
   - GitLens
   - Git History
   - Git Graph