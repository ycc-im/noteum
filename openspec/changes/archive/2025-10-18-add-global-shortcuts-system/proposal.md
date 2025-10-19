# 提案：全局快捷键系统

## 变更信息

- **变更ID**: `add-global-shortcuts-system`
- **创建日期**: 2025-10-18
- **描述**: 为客户端添加全局快捷键操作系统，支持可配置快捷键、快捷键触发的模态框操作
- **范围**: Client Frontend, Backend Services, Database Schema
- **优先级**: 高

## Why

### 用户痛点

1. **操作效率低**: 当前应用完全依赖鼠标操作，专业用户无法使用熟悉的快捷键进行快速操作
2. **工作流不流畅**: 创建新笔记需要多次点击，打断用户的创作思路
3. **个性化缺失**: 无法根据个人习惯自定义操作方式，用户体验一致性差
4. **缺少工作空间**: 没有专门的日常使用入口页面，用户体验不完整

### 业务价值

1. **提升用户效率**: 快捷键可以显著减少操作步骤，提升工作效率
2. **改善用户体验**: 提供现代化的交互方式，符合用户对专业工具的期望
3. **增强竞争力**: 与竞品相比，快捷键支持是专业笔记软件的标配功能
4. **促进用户留存**: 更好的用户体验有助于提高用户满意度和留存率

### 技术必要性

1. **架构完整性**: 全局快捷键系统是现代 Web 应用的基础能力
2. **扩展性**: 建立快捷键框架后，未来可以轻松添加更多快捷操作
3. **一致性好**: 统一的快捷键管理确保不同功能模块的交互一致性

## 摘要

本提案旨在为 Noteum 应用添加一套完整的全局快捷键系统。该系统将支持：

1. 创建 /today 路由的全屏空白页面作为登录后主页
2. 实现全局快捷键监听和管理系统
3. 支持用户自定义快捷键配置并存储到数据库
4. 集成第一个快捷键功能：Command+N (Mac) / Win+N (Windows) 打开模态框
5. 利用现有的 @noteum/ui Dialog 组件

## What Changes

- 扩展数据库模式：在 `user_profiles` 表中添加 `shortcuts` JSON 字段
- 创建 `/today` 路由和全屏空白页面组件作为登录后主页面
- 实现全局快捷键系统：基于 `react-hotkeys-hook` 的快捷键监听和管理框架
- 扩展 Zustand store：添加快捷键配置的状态管理
- 集成 @noteum/ui Dialog：创建新建笔记模态框组件
- 实现后端 API：快捷键配置的 CRUD 操作端点
- 添加快捷键配置界面：支持用户自定义快捷键的设置页面

## Impact

- **Affected specs**: global-shortcuts-system (新建)
- **Affected code**:
  - apps/client/ (添加路由、页面、快捷键系统)
  - apps/services/ (添加 API 端点)
  - packages/ui/ (集成现有 Dialog 组件)
  - Database Schema (扩展用户偏好设置)

## 问题陈述

目前 Noteum 应用缺少快捷键支持，用户需要通过鼠标点击进行操作，效率较低。同时需要一个专门的工作空间页面（/today）作为用户的日常使用入口。

## 解决方案概述

### 1. 架构设计

#### 技术栈选择

- **快捷键监听**: react-hotkeys-hook (成熟的 React 快捷键库)
- **状态管理**: 扩展现有 Zustand store
- **UI组件**: 使用 @noteum/ui 现有的 Dialog 组件
- **数据存储**: PostgreSQL 用户 preferences 字段

#### 组件架构

```
ShortcutProvider (全局提供者)
├── ShortcutManager (快捷键管理器)
├── ShortcutListener (全局监听器)
└── ShortcutConfig (配置管理)
```

### 2. 功能需求

#### 2.1 路由和页面

- 创建 `/today` 路由作为登录后主页面
- 全屏空白页面设计，预留未来功能扩展空间

#### 2.2 快捷键系统核心功能

- 全局快捷键监听和拦截
- 快捷键与用户操作的映射
- 快捷键冲突检测和处理
- 支持组合键（Ctrl, Alt, Shift, Meta/Cmd）

#### 2.3 用户配置管理

- 快捷键配置的增删改查
- 配置持久化到数据库
- 预设快捷键方案
- 导入/导出配置功能

#### 2.4 第一个快捷键实现

- **快捷键**: Command+N (Mac) / Win+N (Windows)
- **功能**: 打开"新建笔记"模态框
- **模态框**: 基于 @noteum/ui Dialog，包含两个按钮

## 实现计划

### 阶段 1: 基础架构

1. 创建快捷键系统核心组件
2. 扩展数据库模式存储快捷键配置
3. 实现 ShortcutProvider 和相关 hooks

### 阶段 2: 路由和页面

1. 创建 `/today` 路由和页面组件
2. 实现全屏空白页面布局
3. 集成快捷键系统到页面

### 阶段 3: 第一个快捷键

1. 实现快捷键监听逻辑
2. 创建"新建笔记"模态框组件
3. 集成 Command+N / Win+N 快捷键

### 阶段 4: 配置系统

1. 实现快捷键配置管理界面
2. 添加配置的后端 API
3. 实现配置的持久化存储

## 技术细节

### 1. 数据库模式变更

```sql
-- 扩展用户偏好设置表
ALTER TABLE user_profiles
ADD COLUMN shortcuts JSON DEFAULT '{}';

-- 快捷键配置结构
{
  "shortcuts": {
    "newNote": {
      "key": "n",
      "modifiers": ["meta", "ctrl"],
      "enabled": true,
      "action": "openNewNoteModal"
    }
  },
  "version": "1.0.0",
  "updatedAt": "2025-10-18T00:00:00Z"
}
```

### 2. 前端组件结构

```typescript
// types/shortcuts.ts
export interface ShortcutConfig {
  key: string
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  enabled: boolean
  action: string
  description?: string
}

export interface ShortcutsState {
  shortcuts: Record<string, ShortcutConfig>
  isListening: boolean
  activeModal?: string
}
```

### 3. 关键依赖

```json
{
  "react-hotkeys-hook": "^4.4.1",
  "is-hotkey": "^0.2.0"
}
```

## 风险评估

### 技术风险

- **低风险**: 使用成熟的第三方库
- **兼容性**: 需要测试不同操作系统和浏览器
- **性能**: 全局监听可能带来轻微性能影响

### 实施风险

- **低风险**: 基于现有架构扩展
- **复杂性**: 快捷键冲突处理需要仔细设计

## 验收标准

1. ✅ `/today` 路由正常工作，显示全屏空白页面
2. ✅ Command+N (Mac) / Win+N (Windows) 快捷键正常工作
3. ✅ 快捷键能打开预设的模态框
4. ✅ 快捷键配置能保存到数据库
5. ✅ 不同用户有独立的快捷键配置
6. ✅ 快捷键不冲突，可以被禁用

## 未来扩展

1. 更多快捷键功能（搜索、导航、格式化等）
2. 快捷键使用统计和分析
3. 快捷键冲突智能解决
4. 快捷键学习模式
5. 插件化快捷键系统

## 影响评估

### 用户体验

- **正面**: 提升操作效率，改善用户体验
- **学习成本**: 用户需要学习快捷键

### 开发影响

- **代码复杂度**: 轻微增加
- **维护成本**: 需要维护快捷键配置系统
- **测试覆盖**: 需要新增快捷键相关测试

## 结论

本提案为 Noteum 应用添加全局快捷键系统，以提升用户操作效率。方案基于现有技术栈，风险可控，建议优先实施。
