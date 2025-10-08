---
name: base-note
status: backlog
created: 2025-10-06T23:41:46Z
progress: 0%
prd: .claude/prds/base-note.md
github: https://github.com/ycc-im/noteum/issues/128
---

# Epic: Base-Note 基础笔记功能

## Overview

Base-Note 是一个以React Flow为核心的视觉化笔记系统实现。本epic将基于现有的React 19 + Dexie架构，构建一个"节点即笔记"的可视化笔记管理工具。核心技术特点包括JSONB多视图位置存储、#tag语法解析、Markdown支持和基础视图管理。

## Architecture Decisions

### 核心架构选择
- **Flow-Based架构**: 采用React Flow作为核心UI范式，每个节点代表一个笔记
- **JSONB位置存储**: 使用notes表中的JSONB字段存储多视图位置信息，避免额外的join操作
- **本地优先策略**: 基于现有Dexie.js IndexedDB存储，确保离线可用性
- **组件化设计**: 基于现有shadcn/ui组件库，保持设计一致性

### 技术栈决策
- **前端框架**: React 19 + TypeScript（已有）
- **存储层**: Dexie.js + IndexedDB（已有）
- **可视化**: React Flow 11.11.4（已有）
- **UI组件**: shadcn/ui + Tailwind CSS（已有）
- **状态管理**: Zustand（已有，待启用）
- **Markdown**: react-markdown + prismjs（新增）
- **构建工具**: Vite（已有）

## Technical Approach

### Frontend Components

#### 核心组件架构
```
src/components/
├── flow/
│   ├── FlowCanvas.tsx          # 主画布组件（基于现有FlowCanvas扩展）
│   ├── NoteNode.tsx            # 笔记节点组件
│   ├── FlowToolbar.tsx         # 工具栏
│   └── ViewSwitcher.tsx        # 视图切换器
├── editor/
│   ├── MarkdownEditor.tsx      # Markdown编辑器
│   ├── TagInput.tsx            # 标签输入组件
│   └── PreviewPane.tsx         # 实时预览
├── views/
│   ├── DailyView.tsx           # 日期视图
│   ├── TagView.tsx             # 标签聚合视图
│   └── TimelineView.tsx        # 时间线视图
└── layout/
    ├── Sidebar.tsx             # 侧边栏
    └── Header.tsx              # 头部导航
```

#### 状态管理设计
```typescript
// stores/useFlowStore.ts
interface FlowState {
  // 视图状态
  currentView: 'daily' | 'tag' | 'timeline';
  nodes: FlowNode[];
  edges: FlowEdge[];

  // 操作方法
  createNote: (position: Point) => Promise<string>;
  updateNote: (id: string, content: string) => Promise<void>;
  connectNotes: (sourceId: string, targetId: string) => Promise<void>;
  switchView: (view: ViewType) => Promise<void>;
}
```

### Backend Services

#### 数据层设计
```typescript
// services/storage/schema.ts - 扩展现有schema
interface NoteRecord {
  id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  view_positions: {
    daily?: Record<string, { x: number; y: number }>;
    tags?: Record<string, { x: number; y: number }>;
    timeline?: Array<{ date: string; position: Point }>;
  };
  metadata: Record<string, any>;
}

interface TagRecord {
  id: string;
  name: string;
  color: string;
  type: 'user' | 'implicit_time' | 'system';
  created_at: Date;
}

interface NoteTagRecord {
  note_id: string;
  tag_id: string;
  created_at: Date;
}
```

#### 服务层架构
```typescript
// services/notes/
├── NoteService.ts              # 笔记CRUD操作
├── TagService.ts               # 标签管理
├── ViewService.ts              # 视图位置管理
├── MarkdownService.ts          # Markdown解析
└── FlowDataService.ts          # React Flow数据同步
```

### Infrastructure

#### 依赖管理
```json
// package.json 新增依赖
{
  "react-markdown": "^9.0.1",
  "remark-gfm": "^4.0.0",
  "prismjs": "^1.29.0",
  "react-syntax-highlighter": "^15.5.0"
}
```

#### 性能优化策略
- **虚拟化渲染**: 大量节点时实现视口裁剪
- **位置缓存**: 前端缓存视图位置，减少数据库查询
- **懒加载**: 按需加载节点内容和Markdown渲染
- **防抖处理**: 节点位置更新使用防抖机制

## Implementation Strategy

### 开发阶段规划

#### 阶段一：数据层重构 (1-2天)
**目标**: 建立完整的数据存储基础

**核心任务**:
- 扩展数据库schema，添加notes表的view_positions JSONB字段
- 实现tags表和note_tags关联表
- 创建数据迁移机制，支持schema版本升级
- 实现基础的CRUD服务层

**技术重点**:
- JSONB字段的类型定义和操作封装
- 数据库事务处理和错误恢复
- 性能优化（索引、查询优化）

#### 阶段二：Flow基础功能 (2-3天)
**目标**: 实现基本的节点操作

**核心任务**:
- 扩展现有FlowCanvas组件，支持笔记节点
- 实现NoteNode组件，支持Markdown渲染
- 添加节点创建、编辑、移动的基础交互
- 实现Zustand状态管理

**技术重点**:
- React Flow自定义节点类型开发
- 节点位置变化的实时同步
- 状态管理的最佳实践

#### 阶段三：标签系统 (2天)
**目标**: 完善标签功能

**核心任务**:
- 实现#tag语法解析器（区别于H1标题）
- 开发隐式时间标签自动生成机制
- 实现标签的创建、关联、显示功能
- 添加基于标签的筛选功能

**技术重点**:
- 正则表达式解析算法
- 时间标签的计算逻辑（ISO周数、月份等）
- 标签与笔记的关联关系管理

#### 阶段四：多视图管理 (2-3天)
**目标**: 实现视图切换和位置管理

**核心任务**:
- 实现Daily视图：按日期时间线布局
- 实现Tag聚合视图：按标签分组布局
- 添加视图切换功能和动画效果
- 优化布局算法和位置计算

**技术重点**:
- 不同视图的布局算法实现
- 位置信息的缓存和同步
- 视图切换时的动画优化

### 风险缓解策略

#### 技术风险
- **性能瓶颈**: 实现节点虚拟化和懒加载
- **数据一致性**: 使用事务和乐观锁机制
- **浏览器兼容**: 添加polyfill和降级方案

#### 产品风险
- **学习成本**: 设计直观的交互引导
- **功能验证**: 早期用户测试和反馈收集

## Task Breakdown Preview

### 高层任务分类（控制在10个以内）

- [ ] **数据层扩展**: 扩展数据库schema和基础服务
- [ ] **Flow节点开发**: 实现自定义React Flow节点组件
- [ ] **状态管理**: 配置Zustand和核心状态逻辑
- [ ] **Markdown集成**: 添加Markdown解析和代码高亮
- [ ] **标签解析**: 实现#tag语法和隐式时间标签
- [ ] **视图引擎**: 开发Daily和Tag视图布局算法
- [ ] **交互优化**: 完善用户交互和动画效果
- [ ] **性能优化**: 实现虚拟化和缓存机制
- [ ] **测试覆盖**: 编写单元测试和集成测试
- [ ] **文档和部署**: 完善文档和部署配置

## Dependencies

### 外部依赖
- **新增npm包**: react-markdown, prismjs, react-syntax-highlighter
- **浏览器API**: IndexedDB (已有支持)
- **无第三方服务**: 完全本地化，无外部API依赖

### 内部依赖
- **现有组件库**: shadcn/ui组件系统
- **存储服务**: 现有Dexie.js存储架构
- **路由系统**: TanStack Router文件系统路由
- **构建工具**: Vite构建和开发服务器

### 前置条件
- 现有项目架构稳定
- shadcn/ui组件库完整
- React Flow基础集成正常

## Tasks Created

### 🚨 执行顺序说明

**第一阶段：基础设施（必须最先执行）**
- [ ] 008.md - **TDD基础设施：测试框架配置和核心工具** (优先执行，无依赖)
  - 🚨 必须在所有其他任务开始之前完成
  - 为整个项目提供TDD框架支持
  - 包括Jest配置、React Testing Library、测试工具等

**第二阶段：并行核心开发（TDD驱动）**
- [ ] 001.md - 数据层扩展：层级关系和schema扩展 (depends_on: [008])
- [ ] 002.md - Markdown渲染：双向编辑和样式扩展 (depends_on: [008])
- [ ] 003.md - Flow节点开发：NoteNode组件和基础交互 (depends_on: [008, 001, 002])
- [ ] 004.md - 标签解析系统：#tag语法解析和隐式时间标签 (depends_on: [008, 001, 002])

**第三阶段：集成优化（TDD驱动）**
- [ ] 005.md - 视图引擎开发：Daily/Tags视图和状态管理 (depends_on: [008, 003, 004])
- [ ] 006.md - 状态管理重构：Zustand全局状态优化 (depends_on: [008, 003])
- [ ] 007.md - 性能优化：虚拟化渲染和懒加载 (depends_on: [005, 006, 008])

### 📊 任务统计
Total tasks: 8
- 阶段1（基础设施）：1个任务，1-2天
- 阶段2（并行核心）：4个任务，并行执行 2-3天
- 阶段3（集成优化）：3个任务，依赖执行 2-3天

**Estimated total effort: 5-8天**（采用TDD并行开发，时间大幅优化）

## Success Criteria (Technical)

### 功能完整性指标
- ✅ Flow-Based笔记创建、编辑、连接功能完整
- ✅ JSONB位置存储支持多视图切换
- ✅ 标签系统解析#tag语法，自动生成时间标签
- ✅ Markdown渲染准确，代码高亮正常

### 性能基准
- ✅ 新笔记创建响应时间 < 3秒
- ✅ 视图切换完成时间 < 1秒
- ✅ JSONB位置查询响应时间 < 50ms
- ✅ 500个节点场景操作流畅度 > 30fps

### 质量标准
- ✅ 核心功能单元测试覆盖率 > 80%
- ✅ 关键路径集成测试通过
- ✅ 主流浏览器兼容性测试通过
- ✅ 用户操作流程无严重Bug

## Estimated Effort

### 时间估算
- **总开发时间**: 9-12天
- **核心功能MVP**: 7-8天
- **优化和测试**: 2-3天
- **文档和部署**: 1天

### 人员配置
- **前端开发**: 1人，负责React组件和交互
- **全栈开发**: 1人，负责数据层和架构

### 关键路径

**🚨 TDD方法关键路径**
1. **阶段1**: TDD基础设施搭建 (008) → 提供测试框架支持
2. **阶段2**: 并行TDD开发
   - 数据层扩展 (001) + Markdown渲染 (002) → 基础能力就绪
   - Flow节点开发 (003) + 标签解析 (004) → 核心功能完成
3. **阶段3**: 集成TDD优化
   - 视图引擎 (005) + 状态管理 (006) → 系统集成
   - 性能优化 (007) → 最终优化

**传统开发关键路径（对比）**
1. 数据层扩展 → Flow节点开发 → 状态管理 → 基础交互
2. Markdown集成 → 标签解析 → 视图引擎 → 交互优化
3. 性能优化 → 测试覆盖 → 文档部署

**TDD优势**: 通过并行开发和测试驱动，大幅缩短开发周期，提高代码质量。

### 风险缓冲
- **技术风险**: +20% 时间缓冲
- **集成复杂度**: +1天测试时间
- **用户反馈**: +1天调整时间

---

**Epic版本**: 1.0
**创建时间**: 2025-10-06
**负责团队**: Noteum开发团队
**优先级**: 高（MVP核心功能）
**预估工作量**: 9-12人天