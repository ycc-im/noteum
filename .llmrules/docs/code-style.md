# 代码风格指南

## 总体原则

1. 代码可读性优先
2. 一致性
3. 自文档化
4. 类型安全

## TypeScript 规范

### 类型定义

```typescript
// ✅ 推荐
type User = {
  id: string;
  name: string;
  age: number;
  email?: string;
};

// ❌ 避免
type User = any;
```

### 类型断言

```typescript
// ✅ 推荐
const user = data as User;

// ❌ 避免
const user = data as any;
```

### 泛型使用

```typescript
// ✅ 推荐
function getFirst<T>(array: T[]): T | undefined {
  return array[0];
}

// ❌ 避免
function getFirst(array: any[]): any {
  return array[0];
}
```

## React 组件规范

### 组件定义

```typescript
// ✅ 推荐
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};

// ❌ 避免
const Button = (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### Hooks 规范

```typescript
// ✅ 推荐
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
};

// ❌ 避免
const useUser = (userId) => {
  const [data, setData] = useState();
  useEffect(() => {
    fetch(userId);
  }, []);
  return data;
};
```

## 命名规范

### 变量命名

```typescript
// ✅ 推荐
const userName = 'John';
const isActive = true;
const handleClick = () => {};

// ❌ 避免
const n = 'John';
const flag = true;
const do_something = () => {};
```

### 常量命名

```typescript
// ✅ 推荐
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = '/api/v1';

// ❌ 避免
const max = 3;
const url = '/api/v1';
```

### 组件命名

```typescript
// ✅ 推荐
const UserProfile = () => {};
const InputField = () => {};

// ❌ 避免
const profile = () => {};
const input_field = () => {};
```

## 注释规范

### 文件头注释

```typescript
/**
 * @file 用户管理模块
 * @description 处理用户相关的数据操作和业务逻辑
 * @module users
 */
```

### 函数注释

```typescript
/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<User>} 用户信息
 * @throws {Error} 当用户不存在时抛出错误
 */
async function getUser(userId: string): Promise<User> {
  // 实现
}
```

### 行内注释

```typescript
// ✅ 推荐
// 检查用户权限
if (!hasPermission(user, 'admin')) {
  throw new Error('权限不足');
}

// ❌ 避免
// 检查
if (!p) throw new Error('error');
```

## 代码组织

### 导入顺序

```typescript
// 1. React 和第三方库导入
import React, { useState, useEffect } from 'react';
import { trpc } from '@trpc/client';

// 2. 类型导入
import type { User } from '@/types';

// 3. 工具函数导入
import { formatDate } from '@/utils/date';

// 4. 组件导入
import { Button } from '@/components/Button';

// 5. 样式导入
import styles from './styles.module.css';
```

### 导出规范

```typescript
// ✅ 推荐
export interface User {
  id: string;
  name: string;
}

export const UserProfile: React.FC<UserProfileProps> = () => {
  // 实现
};

// ❌ 避免
export default function UserProfile() {
  // 实现
}
```

## 错误处理

### 异步错误处理

```typescript
// ✅ 推荐
try {
  const user = await fetchUser(userId);
  return user;
} catch (error) {
  if (error instanceof ApiError) {
    logger.error('API错误', { error });
    throw new CustomError('获取用户失败');
  }
  throw error;
}

// ❌ 避免
try {
  return await fetchUser(userId);
} catch (e: any) {
  console.error(e);
}
```

## 性能优化

### React 优化

```typescript
// ✅ 推荐
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// ❌ 避免
const Component = ({ data }) => {
  return <div>{data}</div>;
};
```

### 事件处理

```typescript
// ✅ 推荐
const MyComponent = () => {
  const handleClick = useCallback(() => {
    // 处理逻辑
  }, []);

  return <button onClick={handleClick}>点击</button>;
};

// ❌ 避免
const MyComponent = () => {
  return <button onClick={() => console.log('clicked')}>点击</button>;
};
```

## 最佳实践

1. 使用 TypeScript 的严格模式
2. 优先使用函数式组件和 Hooks
3. 保持组件纯函数特性
4. 避免过深的组件嵌套
5. 合理使用状态管理
6. 遵循 DRY 原则
7. 编写单元测试
8. 及时处理 ESLint 警告

## 工具配置

### ESLint 规则

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

### Prettier 配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 代码审查清单

1. 类型定义完整性
2. 错误处理完备性
3. 性能优化合理性
4. 代码可读性
5. 测试覆盖率
6. 文档完整性
7. 代码重复度
8. 命名规范性