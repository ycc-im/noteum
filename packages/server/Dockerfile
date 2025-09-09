# Multi-stage build for NestJS server application
# 1. Base stage with Node.js and pnpm
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# 2. Dependencies stage - install all dependencies
FROM base AS deps
WORKDIR /app
# Copy package files for workspace resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/
# Install all dependencies
RUN pnpm install --frozen-lockfile

# 3. Development stage
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure nestjs user owns all files and can write to all directories
RUN chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
CMD ["pnpm", "run", "start:dev"]

# 4. Builder stage - build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# 5. Production dependencies stage
FROM base AS prod-deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile --prod

# 6. Production stage
FROM base AS production
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./package.json

# Copy built application
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/package.json ./packages/server/
COPY --from=builder /app/packages/shared ./packages/shared/

# Set proper ownership
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "packages/server/dist/main.js"]