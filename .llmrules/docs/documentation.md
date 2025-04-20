# 文档规范

## 文档类型

1. 项目文档
2. API文档
3. 组件文档
4. 开发指南
5. 部署文档

## 文档结构规范

### 项目级文档

```
docs/
├── README.md               # 项目概述
├── getting-started.md     # 快速开始指南
├── architecture/          # 架构文档
│   ├── overview.md       # 架构概述
│   ├── backend.md        # 后端架构
│   └── frontend.md       # 前端架构
├── development/          # 开发指南
│   ├── setup.md         # 环境搭建
│   ├── workflow.md      # 开发流程
│   └── guidelines.md    # 开发规范
└── deployment/          # 部署文档
    ├── staging.md       # 测试环境部署
    └── production.md    # 生产环境部署
```

## 文档编写规范

### 文件命名

1. 使用小写字母
2. 使用连字符（-）连接单词
3. 使用有意义的描述性名称
4. 按功能或模块分类

```
✅ 推荐：
getting-started.md
api-authentication.md
database-schema.md

❌ 避免：
GettingStarted.md
api_auth.md
DB.md
```

### Markdown 格式规范

#### 标题层级

```markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
```

#### 列表格式

```markdown
1. 第一项
2. 第二项
   - 子项 A
   - 子项 B
     - 更深层子项
```

#### 代码块

```markdown
# 内联代码
使用 `const` 而不是 `var`

# 代码块
```typescript
function example() {
  return 'hello';
}
```
```

## README.md 模板

```markdown
# 项目名称

简短项目描述

## 功能特性

- 功能1：简短描述
- 功能2：简短描述

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 运行开发服务器
```bash
npm run dev
```

## 项目结构

主要目录和文件的说明

## 技术栈

- 技术1：用途说明
- 技术2：用途说明

## API文档

API文档链接或简要说明

## 贡献指南

如何参与项目开发

## 许可证

项目许可证信息
```

## 组件文档规范

### 组件文档模板

```markdown
# 组件名称

组件描述和用途

## 使用示例

```tsx
import { Button } from '@/components/Button';

function Example() {
  return <Button variant="primary">点击我</Button>;
}
```

## 属性说明

| 属性名   | 类型    | 默认值   | 说明     |
|---------|---------|----------|----------|
| variant | string  | 'primary'| 按钮样式  |
| size    | string  | 'medium' | 按钮大小  |

## 注意事项

使用时需要注意的点
```

## API 文档规范

### 端点文档模板

```markdown
# 用户管理 API

## 创建用户

创建新用户账户

### 请求

`POST /api/v1/users`

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 响应

```json
{
  "code": 200,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
```

## 注释规范

### 代码注释

```typescript
/**
 * 用户服务类
 * @class UserService
 */
class UserService {
  /**
   * 创建新用户
   * @param {CreateUserDto} data - 用户数据
   * @returns {Promise<User>} 创建的用户
   * @throws {ValidationError} 当数据验证失败时
   */
  async createUser(data: CreateUserDto): Promise<User> {
    // 实现
  }
}
```

### TypeScript 类型注释

```typescript
/**
 * 用户数据传输对象
 * @interface UserDto
 */
interface UserDto {
  /** 用户名 */
  name: string;
  /** 电子邮件 */
  email: string;
  /** 角色列表 */
  roles?: string[];
}
```

## 版本控制

### 文档版本

```markdown
---
version: 1.0.0
lastUpdated: 2025-04-20
author: 开发团队
---

# 文档标题
```

### 变更记录

```markdown
## 变更历史

| 版本   | 日期       | 作者   | 变更内容           |
|-------|------------|--------|-------------------|
| 1.0.0 | 2025-04-20| 张三   | 初始版本           |
| 1.1.0 | 2025-04-21| 李四   | 添加新功能文档      |
```

## 文档评审流程

1. 文档创建
   - 遵循模板
   - 完整性检查
   - 格式规范检查

2. 同行评审
   - 技术准确性
   - 文档完整性
   - 示例有效性

3. 技术评审
   - 架构一致性
   - 最佳实践符合度
   - 安全合规性

4. 最终审批
   - 文档质量
   - 发布准备

## 文档维护

### 定期更新

1. 每季度审查
2. 版本升级同步更新
3. Bug修复文档更新
4. 新功能文档添加

### 文档监控

1. 过期文档标记
2. 使用率统计
3. 用户反馈收集
4. 问题跟踪

## 最佳实践

1. 保持文档简洁明了
2. 使用实际代码示例
3. 及时更新文档
4. 多使用图表说明
5. 提供互动性示例
6. 注重用户体验
7. 保持文档一致性
8. 提供搜索功能