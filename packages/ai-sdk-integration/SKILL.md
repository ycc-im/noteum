# @noteum/ai-sdk-integration 技能包

## 概述

统一的 AI 提供商集成包，使用 Vercel AI SDK 构建，支持多个 AI 服务提供商（OpenAI、Anthropic）。

## 核心架构

- **AIService**: 单例模式的 AI 服务主类，提供统一的文本生成和流式接口
- **AIProviderRegistry**: 提供商注册表，管理多个 AI 提供商的健康状态和自动故障转移
- **AIConfigManager**: 配置管理器，处理 AI 提供商的配置加载和更新
- **AICostTracker**: 成本追踪器，记录和估算 API 调用成本
- **AICache**: 缓存系统，支持请求和响应的缓存

## 主要功能

### 1. 文本生成

```typescript
import { AIService } from '@noteum/ai-sdk-integration'

const ai = AIService.getInstance()
const response = await ai.generateText({
  messages: [{ role: 'user', content: 'Hello' }],
  model: 'gpt-4',
})
```

### 2. 流式生成

```typescript
const stream = await ai.generateStream({
  messages: [{ role: 'user', content: 'Tell me a story' }],
})
for await (const chunk of stream) {
  console.log(chunk.content)
}
```

### 3. 成本追踪

- 估算请求成本：`ai.estimateCost(request)`
- 获取使用汇总：`ai.getUsageSummary(7)`
- 获取每日使用情况：`ai.getDailyUsage()`

### 4. 缓存管理

- 启用/禁用缓存：通过 `useCache` 参数控制
- 查看缓存统计：`ai.getCacheStats()`
- 清空缓存：`ai.clearCache()`

### 5. 提供商管理

- 健康检查：`ai.getProviderHealth()`
- 获取注册的提供商：`ai.getRegisteredProviders()`
- 自动故障转移：当一个提供商失败时自动切换到备用提供商

## 配置要求

需要在环境变量或配置文件中设置：

- AI 提供商 API 密钥（OPENAI_API_KEY、ANTHROPIC_API_KEY）
- 默认提供商配置
- 成本限制和缓存配置

## 测试

```bash
npm run test              # 运行测试
npm run test:coverage     # 生成覆盖率报告
npm run test:watch        # 监视模式
```

## 构建

```bash
npm run build    # 构建生产版本
npm run dev      # 开发模式（监听文件变化）
```

## 类型定义

所有类型通过 `src/types/index.ts` 导出，包括：

- AIProvider: 提供商枚举（OPENAI、ANTHROPIC）
- AIRequest: 请求类型
- AIResponse: 响应类型
- AIStreamChunk: 流式数据块类型
- AIError: 错误类型

## 注意事项

- 服务使用单例模式，确保整个应用只初始化一次
- 请求前会自动验证和检查限制
- 流式请求会自动追踪成本并缓存完整响应
- 提供商会定期进行健康检查
