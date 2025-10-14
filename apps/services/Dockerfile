# 多阶段构建 Dockerfile for NestJS + tRPC

# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 复制 package.json 文件
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/services/package.json ./apps/services/
COPY packages/utils/package.json ./packages/utils/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY apps/services/src ./apps/services/src
COPY packages/utils/src ./packages/utils/src
COPY packages/ui/src ./packages/ui/src
COPY tsconfig.json ./

# 构建应用
WORKDIR /app/apps/services
RUN pnpm build

# 第二阶段：运行阶段
FROM node:18-alpine AS runner

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 复制 package.json 文件
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/services/package.json ./apps/services/
COPY packages/utils/package.json ./packages/utils/

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder /app/apps/services/dist ./apps/services/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist

# 复制其他必要文件
COPY apps/services/src ./apps/services/src

# 创建日志目录
RUN mkdir -p /app/logs && chown -R nestjs:nodejs /app

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# 启动应用
CMD ["node", "apps/services/dist/main.js"]