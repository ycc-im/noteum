## Why

当前系统需要一个统一的消息流中间件来支持异步消息处理、事件驱动架构和微服务间的可靠通信。现有的 Redis 缓存服务仅支持基本的键值操作，缺乏消息队列、流处理和发布订阅功能。

## What Changes

- 创建统一的消息流中间件，支持 Redis Stream 和 Kafka 两种消息后端
- 添加消息生产者和消费者抽象接口
- 实现消息序列化、反序列化和错误处理机制
- 提供消息路由、分区和负载均衡功能
- **BREAKING**: 需要添加新的依赖包（Kafka 客户端库）

## Impact

- Affected specs: messaging (新增)
- Affected code: apps/services/src/modules/messaging/ (新建模块)
- Dependencies: kafkajs, 新增消息流相关类型定义
- Integration: 与现有的缓存服务、WebSocket 模块和 tRPC 服务集成
