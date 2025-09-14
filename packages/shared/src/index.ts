// This is the entry point for the shared package.
// Export common types, utilities, components, etc. from here.

export const GREETING = "Hello from shared package!";

// 导出所有 UI 组件
export * from "./components";

// 导出所有类型定义 (包含数据库类型和tRPC类型)
export * from "./types";

// 导出工具类
export * from "./utils";
