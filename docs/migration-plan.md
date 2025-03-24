# Monorepo 结构调整计划

## 背景
当前项目结构将web和server放在packages目录下，不符合标准monorepo结构。根据最佳实践，应用项目应放在apps目录下。

## 迁移目标
1. 将packages/web和packages/server迁移到apps目录
2. 调整相关配置确保构建和运行不受影响

## 需要检查/调整的配置项

### 根目录配置
- package.json中的workspaces配置
- bun.lockb文件
- Docker相关配置
- CI/CD配置

### Web项目
- vite配置中的路径引用
- 测试配置
- 静态资源路径

### Server项目
- 启动脚本
- 中间件配置
- 路由配置

## 执行步骤

1. 创建apps目录
2. 迁移web项目
   ```bash
   mkdir -p apps/web
   mv packages/web/* apps/web/
   ```
3. 迁移server项目
   ```bash
   mkdir -p apps/server 
   mv packages/server/* apps/server/
   ```
4. 更新根package.json的workspaces配置
5. 检查并更新所有路径引用
6. 测试各项功能

## 风险点
1. 路径引用错误导致构建失败
2. Docker配置需要同步更新
3. CI/CD流程可能需要调整