# 项目结构规范

## 目录结构

```
noteum/
├── apps/                # 应用程序目录
│   ├── server/         # 后端服务
│   └── web/           # Web前端应用
├── packages/           # 共享包目录
│   ├── core/          # 核心业务逻辑
│   ├── ui/            # UI组件库
│   └── utils/         # 通用工具函数
├── docker/            # Docker相关配置
└── plans/             # 项目计划和文档
```

## Monorepo 结构说明

### apps 目录
- 存放最终交付的应用程序
- 每个应用都是独立可部署的单元
- 应用间通过 packages 中的共享包通信

### packages 目录
- 存放可复用的内部依赖包
- 每个包都需要有完整的类型定义
- 包之间的依赖关系需要明确声明
- 遵循最小依赖原则

### 包的职责划分

1. core
   - 核心业务逻辑
   - 数据模型定义
   - 业务规则实现

2. ui
   - 可复用UI组件
   - 主题系统
   - 样式工具

3. utils
   - 通用工具函数
   - 类型定义
   - 测试辅助工具

## 文件命名规范

### 目录命名
- 使用 kebab-case
- 清晰表达目录用途
- 避免过深的嵌套（最多4层）

### 文件命名
1. 组件文件
   - 使用 PascalCase
   - 例：`Button.tsx`, `UserProfile.tsx`

2. 工具文件
   - 使用 camelCase
   - 例：`stringUtils.ts`, `dateHelper.ts`

3. 类型定义文件
   - 使用 `.d.ts` 后缀
   - 例：`types.d.ts`, `api.d.ts`

4. 测试文件
   - 使用 `.test.ts` 或 `.spec.ts` 后缀
   - 例：`Button.test.tsx`, `stringUtils.spec.ts`

## 新包开发规范

创建新包时需要包含：

1. 必需文件
   - `package.json`
   - `README.md`
   - `tsconfig.json`
   - `index.ts`

2. 目录结构
   ```
   package-name/
   ├── src/
   │   └── index.ts
   ├── test/
   │   └── index.test.ts
   ├── package.json
   ├── README.md
   └── tsconfig.json
   ```

3. README.md 内容要求
   - 包的用途说明
   - 安装指南
   - 使用示例
   - API文档
   - 注意事项

## 版本控制

1. 分支策略
   - main: 主分支，保持稳定可发布状态
   - develop: 开发分支，集成特性分支
   - feature/*: 特性分支
   - bugfix/*: 缺陷修复分支

2. 提交规范
   - 遵循 Conventional Commits
   - 包名作为 scope
   - 清晰的提交信息

## 依赖管理

1. 包间依赖
   - 明确声明依赖关系
   - 避免循环依赖
   - 保持依赖树扁平

2. 外部依赖
   - 统一版本管理
   - 谨慎添加新依赖
   - 定期更新安全补丁

## 构建优化

1. 构建顺序
   - utils -> core -> ui -> apps
   - 并行构建无依赖包

2. 缓存策略
   - 使用构建缓存
   - 合理设置缓存失效规则

## 发布流程

1. 版本管理
   - 使用 changeset 管理版本
   - 遵循 semver 规范

2. 发布检查
   - 确保测试通过
   - 检查类型定义
   - 验证构建产物

## 注意事项

1. 保持目录结构清晰
2. 避免跨包直接引用源码
3. 及时更新文档
4. 遵循依赖管理规范