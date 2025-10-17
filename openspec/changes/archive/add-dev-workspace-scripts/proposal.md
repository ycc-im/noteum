## Why
开发人员在根目录和apps目录下都需要便捷的方式来启动apps/services和apps/client的开发服务，当前缺少统一的开发工作区脚本。

## What Changes
- 在根目录添加开发工作区启动脚本，支持同时启动services和client
- 在apps目录添加便捷的开发启动脚本
- 统一开发环境端口配置和服务管理
- 添加开发环境状态检查和健康监测

## Impact
- Affected specs: development-workspace
- Affected code: package.json scripts, 新增开发脚本文件
- 改善开发者体验，提供统一的开发启动入口