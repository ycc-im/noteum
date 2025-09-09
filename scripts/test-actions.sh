#!/bin/bash
set -e

# Local GitHub Actions testing script
echo "🧪 Local GitHub Actions Testing"

# Ensure we're in the project root
if [ ! -f ".github/workflows/build.yml" ]; then
    echo "❌ Error: This script must be run from the project root"
    exit 1
fi

# Check if act is installed
if ! command -v act &> /dev/null; then
    echo "❌ Error: 'act' is not installed. Install with: brew install act"
    exit 1
fi

# Function to test a specific workflow
test_workflow() {
    local workflow_file=$1
    local job_name=$2
    
    echo ""
    echo "🔍 Testing workflow: $workflow_file, job: $job_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if act -W ".github/workflows/$workflow_file" -j "$job_name" \
        --container-architecture linux/amd64 \
        --pull=false \
        --verbose; then
        echo "✅ Test passed: $workflow_file - $job_name"
        return 0
    else
        echo "❌ Test failed: $workflow_file - $job_name"
        return 1
    fi
}

# Test different scenarios based on arguments
case "${1:-all}" in
    "test"|"Test Suite")
        echo "Running Test Suite only..."
        test_workflow "build.yml" "test"
        ;;
        
    "build")
        echo "Running Tauri build test..."
        test_workflow "build.yml" "build-tauri"
        ;;
        
    "lint")
        echo "Running linting test locally..."
        echo "🧹 Running prettier check..."
        pnpm lint || echo "⚠️  Linting issues found"
        
        echo "🔍 Running type checking..."
        pnpm typecheck || echo "⚠️  Type checking issues found"
        ;;
        
    "install")
        echo "Testing dependency installation..."
        echo "📦 Installing dependencies with frozen lockfile..."
        pnpm install --frozen-lockfile
        echo "✅ Dependencies installed successfully"
        ;;
        
    "quick")
        echo "Running quick local tests (no Docker)..."
        echo ""
        echo "📦 Testing dependency installation..."
        pnpm install --frozen-lockfile
        
        echo ""
        echo "🧹 Testing linting..."
        pnpm lint
        
        echo ""
        echo "🔍 Testing type checking..."
        pnpm typecheck
        
        echo ""
        echo "🧪 Testing build process..."
        pnpm build:web
        
        echo ""
        echo "✅ All quick tests passed!"
        ;;
        
    "all"|*)
        echo "Running all tests..."
        failed_tests=()
        
        # Quick tests first
        echo "🚀 Phase 1: Quick local tests"
        if ! bash "$0" quick; then
            failed_tests+=("quick-tests")
        fi
        
        echo ""
        echo "🐳 Phase 2: Docker-based GitHub Actions tests"
        
        # Test the main workflow
        if ! test_workflow "build.yml" "test"; then
            failed_tests+=("test-suite")
        fi
        
        # Report results
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📊 Test Results Summary"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        if [ ${#failed_tests[@]} -eq 0 ]; then
            echo "🎉 All tests passed!"
            exit 0
        else
            echo "❌ Failed tests:"
            for test in "${failed_tests[@]}"; do
                echo "  - $test"
            done
            exit 1
        fi
        ;;
esac

echo ""
echo "🏁 Testing completed"