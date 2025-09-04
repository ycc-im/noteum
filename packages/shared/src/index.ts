// This is the entry point for the shared package.
// Export common types, utilities, components, etc. from here.

export const GREETING = "Hello from shared package!";

// 导出所有 UI 组件
export * from './components';

// 导出所有 Proto 类型和 gRPC 服务定义
export * from './types';
