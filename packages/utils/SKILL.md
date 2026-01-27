# @noteum/utils 技能包

## 概述

Noteum 工具函数包，提供端口配置管理、验证和结构化日志记录功能。

## 核心模块

### 1. 端口配置管理

#### 标准端口映射

```typescript
import { ServiceType, getPortConfig, getAllPortConfigs } from '@noteum/utils'

// 获取特定服务的端口配置
const frontendConfig = getPortConfig(ServiceType.FRONTEND)
// { service: 'frontend', internalPort: 5173, externalPort: 9158, ... }

// 获取所有端口配置
const allPorts = getAllPortConfigs()
```

#### 标准端口定义

- **FRONTEND**: 外部 9158 / 内部 5173 (Vite 开发服务器)
- **BACKEND**: 外部 9168 / 内部 3000 (NestJS API 服务器)
- **DATABASE**: 外部 9198 / 内部 5432 (PostgreSQL)
- **CACHE**: 外部 9178 / 内部 6379 (Redis)
- **ADMIN**: 外部 9188 / 内部 80 (PgAdmin)

#### 端口验证

```typescript
import { validatePort, isDevelopmentPort, isReservedPort } from '@noteum/utils'

// 验证端口
const result = validatePort(9158)
// { isValid: true, errors: [], warnings: [] }

// 检查是否为开发端口
if (isDevelopmentPort(9158)) {
  console.log('In development range (9150-9199)')
}

// 检查是否为保留端口
if (isReservedPort(8080)) {
  console.log('Port is reserved and may cause conflicts')
}
```

#### 服务查询

```typescript
import { getServiceByPort } from '@noteum/utils'

const service = getServiceByPort(9158)
// ServiceType.FRONTEND
```

### 2. 结构化日志记录

#### 日志级别

- `DEBUG`: 调试信息
- `INFO`: 一般信息
- `WARN`: 警告
- `ERROR`: 错误
- `FATAL`: 致命错误

#### 日志分类

- `PORT_CONFIG`: 端口配置
- `PORT_VALIDATION`: 端口验证
- `PORT_SCAN`: 端口扫描
- `PORT_CONFLICT`: 端口冲突
- `DOCKER_CONFIG`: Docker 配置
- `ENVIRONMENT`: 环境变量
- `HEALTH_CHECK`: 健康检查
- `AUDIT`: 审计日志

#### 基本使用

```typescript
import { logger, LogCategory } from '@noteum/utils'

// 获取单例日志器
logger.info('Service started', LogCategory.PORT_CONFIG, {
  service: 'frontend',
  port: 9158,
})

logger.error('Failed to connect', LogCategory.HEALTH_CHECK, error, {
  host: 'localhost',
  port: 5432,
})
```

#### 创建专用日志器

```typescript
import { createServiceLogger, createOperationLogger } from '@noteum/utils'

// 为特定服务创建日志器
const serviceLogger = createServiceLogger('frontend')
serviceLogger.info('Starting server', LogCategory.PORT_CONFIG)

// 为特定操作创建日志器
const operationLogger = createOperationLogger('database-migration')
operationLogger.info('Migration started', LogCategory.DOCKER_CONFIG)
```

#### 特定日志函数

```typescript
import {
  logPortConfigurationChange,
  logPortValidation,
  logPortScanResults,
  logPortConflict,
} from '@noteum/utils'

// 记录端口配置变更
logPortConfigurationChange('frontend', 5173, 9158, 'Updated for consistency')

// 记录端口验证结果
logPortValidation(9158, true, [], [])

// 记录端口扫描结果
logPortScanResults(5, 3, 2, 150)

// 记录端口冲突
logPortConflict(9158, ['vite', 'other-app'], 'Restarting vite')
```

#### 关联 ID

```typescript
import { generateCorrelationId, logger } from '@noteum/utils'

const correlationId = generateCorrelationId()
logger.info(
  'Processing request',
  LogCategory.PORT_CONFIG,
  undefined,
  correlationId
)
```

### 3. 端口验证器

```typescript
import { PortValidator } from '@noteum/utils'

const validator = new PortValidator()

// 验证端口范围
const result = validator.validatePort(9158)

// 扫描端口占用
const available = await validator.scanPorts([9158, 9168, 9198])

// 检查端口冲突
const conflicts = await validator.checkConflicts(9158)
```

## 配置说明

### 开发端口范围

- 范围：9150-9199
- 这些端口专门用于 Noteum 开发环境

### 保留端口

- 系统端口（< 1024）
- 常用服务端口（3000, 5000, 8080, 9000 等）
- 数据库端口（5432, 6379, 27017, 3306）
- 标准 Web 端口（80, 443）

## 测试

```bash
npm run test          # 运行测试
npm run type-check    # 类型检查
```

## 构建

```bash
npm run build    # 构建生产版本
npm run dev      # 开发模式（监听文件变化）
```

## 注意事项

- 端口配置主要用于开发环境
- 日志器使用单例模式，确保全局一致性
- 所有端口验证都会返回 errors 和 warnings
- 日志支持彩色输出和时间戳
- 可以为服务和操作创建子日志器，自动包含上下文
