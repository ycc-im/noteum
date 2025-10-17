# 简化 Apps 目录结构任务清单

## 任务列表

1. **验证根目录脚本覆盖性**
   - [x] 确认所有开发工作流都有对应的根目录脚本
   - [x] 测试根目录脚本的完整性和可用性
   - [x] 添加单独重启服务的命令（开发过程中错误恢复）

2. **删除中间层配置**
   - [x] 删除 apps/package.json 中间层配置文件
   - [x] 删除 apps/scripts/ 重复脚本目录
   - [x] 保留 apps/client/package.json 和 apps/services/package.json 应用级配置

3. **保留应用级功能**
   - [x] 确认 apps/client/package.json 中的所有脚本都可用（dev, tauri:*）
   - [x] 确认 apps/services/package.json 中的所有脚本都可用（start:dev, prisma:*, db:*, build等）
   - [x] 验证应用级命令仍能正常工作

4. **更新项目文档**
   - [x] 更新 CLAUDE.md 中的命令说明
   - [x] 更新 README 中的开发指南
   - [x] 确保所有文档指向根目录脚本

5. **验证变更**
   - [x] 测试完整的开发工作流
   - [x] 验证 CI/CD 流程不受影响
   - [x] 确保所有开发者命令仍然可用

6. **添加独立重启脚本**
   - [x] 创建 `dev:restart-services` 脚本，只重启后端服务
   - [x] 创建 `dev:restart-client` 脚本，只重启前端应用
   - [x] 测试重启脚本的正确性和不影响其他服务的特性
   - [x] 更新 package.json 添加新的重启命令

7. **清理和优化**
   - [x] 检查是否有其他冗余配置
   - [x] 优化脚本的性能和用户体验
   - [x] 添加使用说明和错误处理

## 注意事项
- 确保不破坏现有的构建和部署流程
- 保持向后兼容性，避免影响团队协作
- 测试所有常见的开发场景