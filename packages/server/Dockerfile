# Multi-stage Dockerfile for NestJS Server Application
# Optimized for both development and production builds

# =======================================
# Stage 1: Base Image with Dependencies
# =======================================
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm for efficient package management
RUN npm install -g pnpm

# =======================================
# Stage 2: Dependency Installation
# =======================================
FROM base AS deps

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies with frozen lockfile for reproducible builds
RUN pnpm install --frozen-lockfile --production=false

# =======================================
# Stage 3: Development Stage
# =======================================
FROM base AS development

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY . .

# Set working directory to server package
WORKDIR /app/packages/server

# Expose development port
EXPOSE 3001

# Health check for development
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Development command with hot reload
CMD ["pnpm", "run", "start:dev"]

# =======================================
# Stage 4: Build Stage
# =======================================
FROM base AS builder

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source code
COPY . .

# Build the shared package first (if it has a build step)
WORKDIR /app/packages/shared
RUN if [ -f "package.json" ] && grep -q "build" package.json; then pnpm run build; fi

# Build the server application
WORKDIR /app/packages/server
RUN pnpm run build

# =======================================
# Stage 5: Production Dependencies
# =======================================
FROM base AS prod-deps

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --production=true

# =======================================
# Stage 6: Production Stage
# =======================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 nestjs

WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps --chown=nestjs:nestjs /app/node_modules ./node_modules
COPY --from=prod-deps --chown=nestjs:nestjs /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=prod-deps --chown=nestjs:nestjs /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy built application
COPY --from=builder --chown=nestjs:nestjs /app/packages/server/dist ./packages/server/dist
COPY --from=builder --chown=nestjs:nestjs /app/packages/shared/dist ./packages/shared/dist 2>/dev/null || true

# Copy necessary runtime files
COPY --from=builder --chown=nestjs:nestjs /app/packages/server/package.json ./packages/server/
COPY --from=builder --chown=nestjs:nestjs /app/packages/shared/package.json ./packages/shared/ 2>/dev/null || true

# Set working directory to server package
WORKDIR /app/packages/server

# Switch to non-root user
USER nestjs

# Expose production port
EXPOSE 3001

# Health check for production
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init for proper signal handling in containers
ENTRYPOINT ["dumb-init", "--"]

# Production command
CMD ["node", "dist/main.js"]