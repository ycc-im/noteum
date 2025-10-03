# Multi-stage Dockerfile for TanStack Start Web Application
# Optimized for layer caching and minimal production image size

# =============================================================================
# Build Stage: Install dependencies and build the application
# =============================================================================
FROM node:20-alpine AS builder

# Install pnpm globally for better dependency management
RUN npm install -g pnpm@9

# Set working directory
WORKDIR /app

# Copy workspace configuration first for better layer caching
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy all package.json files to enable workspace dependencies resolution
COPY packages/shared/package.json ./packages/shared/
COPY packages/web/package.json ./packages/web/

# Install dependencies using pnpm
# Using --frozen-lockfile to ensure reproducible builds
RUN pnpm install --frozen-lockfile

# Copy shared package source code
COPY packages/shared/ ./packages/shared/

# Copy web application source code
COPY packages/web/ ./packages/web/

# Build the shared package first (if it needs building)
RUN cd packages/shared && pnpm build || true

# =============================================================================
# Development Stage: For development with hot reloading (no build step)
# =============================================================================
FROM builder AS development
# Install curl for healthcheck
RUN apk add --no-cache curl
# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
# Set ownership and switch user
RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "cd packages/web && pnpm run dev"]

# =============================================================================
# Builder Final Stage: Complete the build
# =============================================================================
FROM builder AS builder-final
# Build the web application
RUN cd packages/web && pnpm run build

# =============================================================================
# Production Stage: Create minimal runtime image
# =============================================================================
FROM node:20-alpine AS production

# Install pnpm for production dependencies
RUN npm install -g pnpm@9

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy package.json and lockfile for production dependency installation
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=nextjs:nodejs packages/web/package.json ./packages/web/
COPY --chown=nextjs:nodejs packages/shared/package.json ./packages/shared/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.output ./packages/web/.output
COPY --from=builder --chown=nextjs:nodejs /app/packages/shared/dist ./packages/shared/dist

# Copy any additional runtime assets
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/public ./packages/web/public

# Switch to non-root user
USER nextjs

# Set working directory to web package
WORKDIR /app/packages/web

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check to monitor application status
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "http.get('http://localhost:3000/api/health', (res) => { \
        process.exit(res.statusCode === 200 ? 0 : 1) \
    }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", ".output/server/index.mjs"]