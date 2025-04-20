# 测试规范

## 测试原则

1. 测试优先开发（TDD）
2. 保持测试独立性
3. 一个测试只测试一个概念
4. 保持测试简单且有意义
5. 测试代码与生产代码同等重要

## 测试覆盖率要求

```yaml
覆盖率指标：
- 语句覆盖率（Statements）: >= 80%
- 分支覆盖率（Branches）: >= 75%
- 函数覆盖率（Functions）: >= 85%
- 行覆盖率（Lines）: >= 80%
```

## 单元测试规范

### 测试文件命名

```typescript
// 源文件：Button.tsx
// 测试文件：Button.test.tsx 或 Button.spec.tsx
```

### 测试套件组织

```typescript
describe('Button Component', () => {
  describe('渲染测试', () => {
    it('应该正确渲染默认样式', () => {
      // 测试实现
    });

    it('应该根据variant属性渲染不同样式', () => {
      // 测试实现
    });
  });

  describe('交互测试', () => {
    it('点击时应该调用onClick处理函数', () => {
      // 测试实现
    });
  });
});
```

### 测试示例

```typescript
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('应该正确渲染文本内容', () => {
    const { getByText } = render(
      <Button onClick={() => {}}>点击我</Button>
    );
    expect(getByText('点击我')).toBeInTheDocument();
  });

  it('点击时应该触发onClick事件', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>点击我</Button>
    );
    
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 集成测试规范

### API 测试

```typescript
describe('UserAPI', () => {
  beforeAll(async () => {
    // 设置测试数据库
    await setupTestDatabase();
  });

  afterAll(async () => {
    // 清理测试数据库
    await cleanupTestDatabase();
  });

  it('应该成功创建用户', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Test User',
      email: 'test@example.com'
    });
  });
});
```

### 数据库集成测试

```typescript
describe('UserRepository', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('应该正确创建并检索用户', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const createdUser = await userRepository.create(userData);
    const foundUser = await userRepository.findById(createdUser.id);

    expect(foundUser).toMatchObject(userData);
  });
});
```

## 端到端测试规范

### 测试场景定义

```typescript
describe('用户注册流程', () => {
  it('新用户应该能够成功注册', async () => {
    await page.goto('/register');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('.welcome-message'))
      .toContainText('Welcome, test@example.com');
  });
});
```

### 页面对象模式

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// tests/login.spec.ts
describe('登录功能', () => {
  let loginPage: LoginPage;

  beforeEach(async () => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  it('使用有效凭据应该能够成功登录', async () => {
    await loginPage.login('user@example.com', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Mock 使用规范

### 服务 Mock

```typescript
jest.mock('@/services/api', () => ({
  fetchUser: jest.fn().mockResolvedValue({
    id: 1,
    name: 'Test User'
  })
}));
```

### 时间 Mock

```typescript
describe('定时任务测试', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该在5秒后执行回调', () => {
    const callback = jest.fn();
    setTimeout(callback, 5000);

    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalled();
  });
});
```

## 测试工具配置

### Jest 配置

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80
    }
  }
};
```

### Playwright 配置

```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' }
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' }
    }
  ]
};

export default config;
```

## 测试数据管理

### 工厂模式

```typescript
// factories/user.ts
export const createUser = (overrides = {}) => ({
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: new Date(),
  ...overrides
});

// tests/user.test.ts
it('应该更新用户信息', () => {
  const user = createUser({ name: 'Original Name' });
  const updatedUser = updateUser(user, { name: 'New Name' });
  expect(updatedUser.name).toBe('New Name');
});
```

### 测试数据清理

```typescript
describe('数据库测试', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // 清理测试数据
    const tablenames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    for (const { tablename } of tablenames) {
      if (tablename !== '_prisma_migrations') {
        try {
          await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
          );
        } catch (error) {
          console.log({ error });
        }
      }
    }
  });
});
```

## CI 集成

### GitHub Actions 配置

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Run e2e tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: coverallsapp/github-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## 测试检查清单

1. 测试命名清晰且具描述性
2. 测试用例相互独立
3. 避免测试实现细节
4. 合理使用 setup 和 teardown
5. 避免测试代码中的逻辑判断
6. 保持测试简单直接
7. 确保测试数据的完整性
8. 适当使用测试夹具（fixtures）
9. 定期审查和维护测试代码
10. 保持测试执行速度