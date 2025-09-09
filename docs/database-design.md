# 数据库设计文档

## PostgreSQL版本控制方案决定

**决定日期**: 2025-09-05  
**状态**: ✅ 已确认

### 选择的方案: 组合方案（主表 + 历史表 + AI向量）

**原因**:
1. **完全控制**: 可以精确控制版本创建时机和策略
2. **AI集成**: 天然支持向量搜索和语义版本控制
3. **云平台兼容**: 不依赖特定扩展，全云平台兼容
4. **业务逻辑集成**: 可与应用业务深度集成
5. **可观测性**: 完全透明的版本创建和调试

**拒绝的方案**: 
- ❌ `temporal_tables`扩展 - 依赖风险高，云平台支持有限
- ❌ 纯插件方案 - 灵活性不足，无法自定义版本策略

## 笔记数据结构需求

### 1. React Flow集成需求
笔记需要与React Flow的Node数据格式兼容：

```typescript
// React Flow Node格式
interface ReactFlowNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: any; // 我们的笔记数据在这里
  style?: React.CSSProperties;
  className?: string;
}
```

### 2. Tags支持
每个笔记条目需要支持标签系统：
- 多标签支持
- 标签分类（颜色、优先级等）
- 标签搜索和过滤

### 3. Slots系统
笔记条目需要支持多个连接点（slots）：
- **4个角**: top-left, top-right, bottom-left, bottom-right
- **4条边**: top, right, bottom, left
- 每个slot可以有不同的类型和用途
- slot可以连接到其他笔记的slot

### 4. 待探索需求
- 笔记间的关系和连接
- 图形化编辑器支持
- 协作功能
- 更多自定义属性

## 初步数据库架构设计

### 主要表结构
1. **users** - 用户表
2. **notes** - 主笔记表
3. **note_versions** - 版本历史表
4. **tags** - 标签表
5. **note_tags** - 笔记标签关联表
6. **note_slots** - 笔记连接点表
7. **note_connections** - 笔记间连接表
