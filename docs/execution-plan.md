# 迁移执行计划

## 步骤1：准备工作
- 创建新分支用于迁移工作
- 创建apps目录结构

## 步骤2：迁移Web项目
1. 移动文件
```bash
mkdir -p apps/web
git mv packages/web/* apps/web/
```

2. 更新配置文件
- 检查package.json中的依赖路径
- 更新构建脚本路径
- 检查导入路径

## 步骤3：迁移Server项目
1. 移动文件
```bash
mkdir -p apps/server
git mv packages/server/* apps/server/
```

2. 更新配置文件
- 检查package.json中的依赖路径
- 更新服务启动脚本
- 检查导入路径

## 步骤4：更新根目录配置
1. 修改package.json中的workspaces配置
```json
{
  "workspaces": [
    "packages/*",
    "apps/*"
  ]
}
```

2. 更新Docker配置
- 检查Dockerfile中的路径
- 更新docker-compose.yml中的构建上下文

## 步骤5：测试验证
1. 清理依赖并重新安装
```bash
rm -rf node_modules
bun install
```

2. 验证构建
```bash
bun run build
```

3. 验证开发环境
```bash
bun run dev
```

## 步骤6：清理工作
- 删除空的packages/web和packages/server目录
- 提交更改
- 创建Pull Request