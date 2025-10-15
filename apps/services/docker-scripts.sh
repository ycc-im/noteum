#!/bin/bash

# Noteum Docker Management Script
# Usage: ./docker-scripts.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Show help
show_help() {
    cat << EOF
Noteum Docker Management Script

Usage: $0 [command] [options]

Commands:
    dev-up          Start development environment
    dev-down        Stop development environment
    dev-logs        Show development logs
    dev-shell       Access development container shell

    prod-up         Start production environment
    prod-down       Stop production environment
    prod-logs       Show production logs

    test-up         Start test environment
    test-down       Stop test environment
    test-run        Run tests

    tools-up        Start development tools (pgAdmin, Redis Commander)
    tools-down      Stop development tools

    build           Build Docker images
    clean           Clean up Docker resources
    status          Show container status

    help            Show this help message

Examples:
    $0 dev-up                       # Start development environment
    $0 dev-logs -f app              # Follow app logs
    $0 prod-up --build              # Build and start production
    $0 test-run                     # Run tests

EOF
}

# Check Docker and Docker Compose
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
}

# Start development environment
dev_up() {
    print_status "Starting development environment..."
    docker-compose up -d
    print_success "Development environment started"
    print_status "App: http://localhost:3000"
    print_status "PostgreSQL: localhost:5432"
    print_status "Redis: localhost:6379"
}

# Stop development environment
dev_down() {
    print_status "Stopping development environment..."
    docker-compose down
    print_success "Development environment stopped"
}

# Show development logs
dev_logs() {
    local service=${1:-app}
    print_status "Showing logs for service: $service"
    docker-compose logs -f "$service" "${@:2}"
}

# Access development container shell
dev_shell() {
    print_status "Accessing development container shell..."
    docker-compose exec app sh
}

# Start production environment
prod_up() {
    print_status "Starting production environment..."
    if [[ "$*" == *"--build"* ]]; then
        docker-compose -f docker-compose.prod.yml build --no-cache
    fi
    docker-compose -f docker-compose.prod.yml up -d
    print_success "Production environment started"
}

# Stop production environment
prod_down() {
    print_status "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Production environment stopped"
}

# Show production logs
prod_logs() {
    local service=${1:-app}
    print_status "Showing production logs for service: $service"
    docker-compose -f docker-compose.prod.yml logs -f "$service" "${@:2}"
}

# Start test environment
test_up() {
    print_status "Starting test environment..."
    docker-compose -f docker-compose.test.yml up -d postgres-test redis-test
    print_success "Test environment started"
}

# Stop test environment
test_down() {
    print_status "Stopping test environment..."
    docker-compose -f docker-compose.test.yml down -v
    print_success "Test environment stopped"
}

# Run tests
test_run() {
    print_status "Running tests..."
    docker-compose -f docker-compose.test.yml run --rm test-runner
}

# Start development tools
tools_up() {
    print_status "Starting development tools..."
    docker-compose --profile tools up -d
    print_success "Development tools started"
    print_status "pgAdmin: http://localhost:8080 (admin@noteum.dev / admin)"
    print_status "Redis Commander: http://localhost:8081"
}

# Stop development tools
tools_down() {
    print_status "Stopping development tools..."
    docker-compose --profile tools down
    print_success "Development tools stopped"
}

# Build Docker images
build_images() {
    print_status "Building Docker images..."
    docker-compose build --no-cache
    print_success "Docker images built"
}

# Clean up Docker resources
clean() {
    print_status "Cleaning up Docker resources..."

    # Stop and remove containers
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.test.yml down --remove-orphans -v 2>/dev/null || true

    # Remove images
    docker images "noteum*" -q | xargs -r docker rmi -f 2>/dev/null || true

    # Clean up unused Docker resources
    docker system prune -f

    print_success "Docker cleanup completed"
}

# Show container status
status() {
    print_status "Container status:"
    echo
    docker-compose ps 2>/dev/null || print_warning "Development containers not running"
    echo
    docker-compose -f docker-compose.prod.yml ps 2>/dev/null || print_warning "Production containers not running"
    echo
    docker-compose -f docker-compose.test.yml ps 2>/dev/null || print_warning "Test containers not running"
}

# Main script logic
main() {
    check_dependencies

    case "${1:-help}" in
        dev-up)
            dev_up
            ;;
        dev-down)
            dev_down
            ;;
        dev-logs)
            dev_logs "${@:2}"
            ;;
        dev-shell)
            dev_shell
            ;;
        prod-up)
            prod_up "${@:2}"
            ;;
        prod-down)
            prod_down
            ;;
        prod-logs)
            prod_logs "${@:2}"
            ;;
        test-up)
            test_up
            ;;
        test-down)
            test_down
            ;;
        test-run)
            test_run
            ;;
        tools-up)
            tools_up
            ;;
        tools-down)
            tools_down
            ;;
        build)
            build_images
            ;;
        clean)
            clean
            ;;
        status)
            status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"