## Context

系统需要一个消息流中间件来支持：

- 异步事件处理（文档更新、用户通知等）
- 微服务间的可靠通信
- 实时协作事件分发
- 后台任务处理（AI 分析、文档索引等）

现有的基础设施已包含 Redis，但仅用于缓存。需要扩展支持消息流和队列功能。

## Goals / Non-Goals

- Goals:
  - 统一的消息流抽象接口
  - 支持 Redis Stream 和 Kafka 两种后端
  - 可配置的消息序列化格式
  - 错误重试和死信队列机制
  - 与现有 NestJS 架构无缝集成

- Non-Goals:
  - 不实现完整的企业级消息中间件功能（如事务消息、分布式事务）
  - 不支持消息路由的复杂拓扑结构
  - 不提供消息监控和管理界面

## Decisions

- Decision: 使用适配器模式支持多种消息后端
  - Why: 允许未来轻松添加新的消息系统（如 RabbitMQ）
  - Alternatives considered: 直接实现具体类、使用工厂模式

- Decision: 消息序列化使用 JSON 格式
  - Why: 与现有 tRPC 和 WebSocket 保持一致，易于调试
  - Alternatives considered: Avro、Protocol Buffers（性能更好但复杂度更高）

- Decision: 消息消费者使用 NestJS 的 `@Injectable()` 装饰器
  - Why: 与现有依赖注入系统集成
  - Alternatives considered: 独立的消费者类、装饰器模式

## Risks / Trade-offs

- [性能] → JSON 序列化相比二进制格式有性能损失，但降低了复杂度
- [可靠性] → Redis Stream 在单点故障情况下可能丢失消息，需要配置持久化
- [复杂度] → 支持多种后端增加了代码复杂度，但提供了灵活性

## Migration Plan

1. 实现 Redis Stream 适配器（默认）
2. 添加 Kafka 适配器作为可选项
3. 逐步迁移现有的实时协作事件到消息流
4. 添加新的异步功能（AI 分析、搜索索引等）

## Open Questions

- 是否需要支持消息分区和负载均衡？
- 消息消费者组如何管理？
- 错误重试策略应该如何配置？
