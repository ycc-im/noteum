# 开发工作流程指南

本文档描述了 Noteum 项目的标准开发工作流程，包括分支管理和测试驱动开发(TDD)实践。

## 🌳 分支管理规范

### 核心原则

- **禁止在 main 分支直接开发**：所有开发工作必须在功能分支进行
- **强制创建功能分支**：如果在 main 分支，必须先创建新分支
- **标准命名格式**：`[###-task-description]`

### 分支工作流程

#### 1. 检查当前分支

```bash
git branch  # 查看当前分支
```

#### 2. 如果在 main 分支，创建功能分支

```bash
# 确保在最新版本
git pull origin main

# 创建功能分支
git checkout -b 123-add-user-authentication
```

#### 3. 在功能分支开发

```bash
# 进行开发工作
git add .
git commit -m "feat: implement user authentication"
git push origin 123-add-user-authentication
```

#### 4. 创建 Pull Request

- 标题遵循约定式提交格式
- 描述中包含变更详情和测试信息
- 确保所有检查通过

### 分支命名规范

```
[ISSUE_ID]-BRIEF_DESCRIPTION

示例：
- 123-add-user-login
- 456-fix-memory-leak
- 789-improve-api-performance
```

## 🧪 测试驱动开发 (TDD)

### TDD 循环：红-绿-重构

#### 1. 🔴 Red 阶段：编写失败的测试

```typescript
// user.service.spec.ts
describe('UserService', () => {
  it('should create a new user', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' }
    const user = await userService.createUser(userData)

    expect(user).toBeDefined()
    expect(user.id).toBeDefined()
  })
})
```

#### 2. 🟢 Green 阶段：编写最小代码使测试通过

```typescript
// user.service.ts
async createUser(userData: CreateUserDto): Promise<User> {
  const user = this.userRepository.create(userData);
  return this.userRepository.save(user);
}
```

#### 3. 🟡 Refactor 阶段：重构代码保持测试通过

```typescript
// user.service.ts (重构后)
async createUser(userData: CreateUserDto): Promise<User> {
  this.validateUserData(userData);

  const existingUser = await this.findByEmail(userData.email);
  if (existingUser) {
    throw new ConflictException('User already exists');
  }

  const user = this.userRepository.create(userData);
  return this.userRepository.save(user);
}
```

### 测试文件组织

```
src/
├── user.service.ts
├── user.service.spec.ts
├── user.controller.ts
├── user.controller.spec.ts
└── types/
    ├── user.types.ts
    └── user.types.spec.ts (如果需要)
```

### 不需要测试的文件类型

以下文件类型免于 TDD 要求：

#### ✅ 免除文件类型

- **配置文件**：`.env`, `.config.js`, `tsconfig.json`
- **常量定义**：纯常量和枚举文件
- **构建脚本**：`scripts/`, `build/`, `deploy/` 目录下的脚本
- **文档文件**：`.md`, `.txt`, README 文件
- **类型定义**：仅包含类型的 `.d.ts` 文件
- **静态资源**：图片、样式文件等

#### 🗑️ 临时文件处理

开发过程中可能会产生一些临时文件，特别是：

- `vitest.config.ts.timestamp-*.mjs`：Vite/Vitest 编译的临时配置文件
- `*.tmp`, `*.temp`：各种工具生成的临时文件

这些文件已经被 `.gitignore` 忽略，可以使用 `pnpm clean:temp` 清理。

#### ❌ 需要测试的文件类型

- 业务逻辑文件 (services, controllers)
- 工具函数 (utils, helpers)
- 数据模型和 schemas
- API 端点
- React 组件
- 数据库操作

## ✅ 预提交验证

### 必须通过的检查

1. **所有测试通过**

   ```bash
   pnpm test
   ```

2. **代码风格检查**

   ```bash
   pnpm lint
   ```

3. **TypeScript 编译**

   ```bash
   pnpm type-check
   ```

4. **分支检查**（不能在 main 分支）

### 预提交 Hook 配置

项目配置了 husky 预提交钩子，会自动运行这些检查。

## 📋 代码审查清单

### 分支管理合规性

- [ ] 分支名称遵循 `[###-task-description]` 格式
- [ ] 基于 main 分支创建
- [ ] 没有 main 分支的直接提交
- [ ] 包含相关的 issue 编号

### TDD 实践验证

- [ ] 新功能有对应的测试
- [ ] 测试覆盖了关键路径
- [ ] 测试文件命名正确 (`.spec.ts` 或 `.test.ts`)
- [ ] 测试先于实现编写

### 代码质量

- [ ] 代码风格符合项目标准
- [ ] TypeScript 类型定义完整
- [ ] 没有未使用的依赖
- [ ] 错误处理恰当

## 🚨 例外处理

### 什么情况下可以例外？

1. **紧急修复**：生产环境的紧急 bug 修复
2. **配置变更**：仅修改配置文件的变更
3. **文档更新**：纯文档内容的更新

### 例外处理流程

1. **文档化**：在提交信息中明确说明例外原因
2. **审批**：获得团队负责人的批准
3. **替代措施**：实施其他质量保证措施

### 例外提交信息格式

```
fix: emergency hotfix for production crash

BREAKING CHANGE: This bypasses normal TDD requirements due to production emergency.

Reason: Production service unavailable
Approved by: @team-lead
Alternative QA: Manual testing performed in staging environment
```

## 🛠️ 实用工具和命令

### 自动化 Git Hooks

项目已配置 **husky** 和 **pre-commit hooks**，在每次提交时自动执行以下检查：

```bash
# 自动执行的预提交检查
pnpm pre-commit-check
```

**预提交检查内容**：

- ✅ 分支管理：确保不在 main 分支直接提交
- ✅ 分支命名：检查是否遵循 `[###-task-description]` 格式
- ✅ 测试检查：验证测试文件和测试状态
- ✅ 代码风格：运行 ESLint 检查
- ✅ 类型检查：确保 TypeScript 编译通过
- ✅ TDD 合规性：检查源代码和测试文件的平衡

### 分支管理

```bash
# 检查当前状态
git status
git branch

# 创建新功能分支
git checkout -b 123-feature-name

# 同步最新 main 分支
git fetch origin
git pull origin main

# 推送分支
git push origin 123-feature-name
```

### 测试相关

```bash
# 运行所有测试
pnpm test

# 运行特定文件测试
pnpm test user.service.spec.ts

# 查看测试覆盖率
pnpm test --coverage

# 监听模式
pnpm test --watch
```

### 代码质量

```bash
# 代码检查
pnpm lint

# 自动修复
pnpm lint --fix

# 类型检查
pnpm type-check

# 手动运行预提交检查
pnpm pre-commit-check
```

### 项目清理

```bash
# 清理临时文件（Vite/Vitest 时间戳文件等）
pnpm clean:temp

# 完全清理（包括 node_modules）
pnpm clean
```

## 📖 参考资料

- [约定式提交](https://www.conventionalcommits.org/)
- [Jest 测试框架](https://jestjs.io/)
- [Vitest 测试框架](https://vitest.dev/)
- [TypeScript 严格模式](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

---

**记住**：这些规范的存在是为了确保代码质量、团队协作效率和项目的长期可维护性。如有疑问，请随时咨询团队负责人。
