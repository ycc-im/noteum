# Noteum Docker Makefile
# Simplified commands for Docker operations

.PHONY: help dev-up dev-down dev-logs dev-shell prod-up prod-down prod-logstest-up test-down test-run tools-up tools-down build clean status install

# Default target
help: ## Show this help message
	@echo "Noteum Docker Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Development Commands
dev-up: ## Start development environment
	docker-compose up -d

dev-down: ## Stop development environment
	docker-compose down

dev-logs: ## Show development logs (use SERVICE=app to specify)
	docker-compose logs -f $(SERVICE)

dev-shell: ## Access development container shell
	docker-compose exec app sh

dev-restart: ## Restart development environment
	docker-compose restart

# Production Commands
prod-up: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production environment
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Show production logs (use SERVICE=app to specify)
	docker-compose -f docker-compose.prod.yml logs -f $(SERVICE)

prod-restart: ## Restart production environment
	docker-compose -f docker-compose.prod.yml restart

# Test Commands
test-up: ## Start test environment
	docker-compose -f docker-compose.test.yml up -d postgres-test redis-test

test-down: ## Stop test environment
	docker-compose -f docker-compose.test.yml down -v

test-run: ## Run tests
	docker-compose -f docker-compose.test.yml run --rm test-runner

# Development Tools
tools-up: ## Start development tools (pgAdmin, Redis Commander)
	docker-compose --profile tools up -d

tools-down: ## Stop development tools
	docker-compose --profile tools down

# Build Commands
build: ## Build Docker images
	docker-compose build

build-prod: ## Build production images
	docker-compose -f docker-compose.prod.yml build --no-cache

build-no-cache: ## Build images without cache
	docker-compose build --no-cache

# Maintenance Commands
clean: ## Clean up Docker resources
	docker-compose down --remove-orphans || true
	docker-compose -f docker-compose.prod.yml down --remove-orphans || true
	docker-compose -f docker-compose.test.yml down --remove-orphans -v || true
	docker system prune -f

clean-all: ## Clean up all Docker resources including images
	docker-compose down --remove-orphans --rmi all || true
	docker-compose -f docker-compose.prod.yml down --remove-orphans --rmi all || true
	docker-compose -f docker-compose.test.yml down --remove-orphans --rmi all -v || true
	docker system prune -a -f --volumes

status: ## Show container status
	@echo "Development containers:"
	@docker-compose ps 2>/dev/null || echo "Not running"
	@echo ""
	@echo "Production containers:"
	@docker-compose -f docker-compose.prod.yml ps 2>/dev/null || echo "Not running"
	@echo ""
	@echo "Test containers:"
	@docker-compose -f docker-compose.test.yml ps 2>/dev/null || echo "Not running"

# Installation Commands
install: ## Install dependencies and setup environment
	@echo "Installing dependencies..."
	npm install -g pnpm@8.15.0
	pnpm install

setup-dev: ## Setup development environment
	@echo "Setting up development environment..."
	cp .env.example .env.local
	@echo "Created .env.local file. Please edit it with your configuration."
	make install

# Database Commands
db-migrate: ## Run database migrations
	docker-compose exec app pnpm prisma migrate dev

db-reset: ## Reset database
	docker-compose exec app pnpm prisma migrate reset

db-seed: ## Seed database
	docker-compose exec app pnpm prisma db seed

db-studio: ## Open Prisma Studio
	docker-compose exec app pnpm prisma studio

# Utility Commands
logs: ## Show all logs
	docker-compose logs -f

logs-app: ## Show application logs
	docker-compose logs -f app

logs-db: ## Show database logs
	docker-compose logs -f postgres

logs-redis: ## Show Redis logs
	docker-compose logs -f redis

# Quick start commands
quick-start: setup-dev dev-up ## Quick setup and start development
	@echo "Quick start complete!"
	@echo "App: http://localhost:3000"
	@echo "Database: localhost:5432"
	@echo "Redis: localhost:6379"

full-start: setup-dev dev-up tools-up ## Full setup with development tools
	@echo "Full start complete!"
	@echo "App: http://localhost:3000"
	@echo "pgAdmin: http://localhost:8080 (admin@noteum.dev / admin)"
	@echo "Redis Commander: http://localhost:8081"