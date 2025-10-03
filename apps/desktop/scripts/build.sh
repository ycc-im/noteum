#!/bin/bash
set -e

# Tauri cross-platform build script
echo "🚀 Starting Tauri build process..."

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TAURI_DIR="$PROJECT_ROOT/packages/tauri"
WEB_DIR="$PROJECT_ROOT/packages/web"

echo "📁 Project structure:"
echo "  Root: $PROJECT_ROOT"
echo "  Web:  $WEB_DIR" 
echo "  Tauri: $TAURI_DIR"

# Check if we're in the right directory
if [ ! -f "$TAURI_DIR/src-tauri/Cargo.toml" ]; then
  echo "❌ Error: Tauri project not found at $TAURI_DIR"
  exit 1
fi

if [ ! -f "$WEB_DIR/package.json" ]; then
  echo "❌ Error: Web project not found at $WEB_DIR"
  exit 1
fi

# Parse command line arguments
TARGET=""
RELEASE=false
CLEAN=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --target)
      TARGET="$2"
      shift 2
      ;;
    --release)
      RELEASE=true
      shift
      ;;
    --clean)
      CLEAN=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --target TARGET    Rust target triple (e.g., x86_64-apple-darwin)"
      echo "  --release         Build in release mode"
      echo "  --clean           Clean build artifacts before building"
      echo "  -h, --help        Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Change to tauri directory
cd "$TAURI_DIR"

# Clean if requested
if [ "$CLEAN" = true ]; then
  echo "🧹 Cleaning build artifacts..."
  rm -rf src-tauri/target
  rm -rf node_modules
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build web frontend first
echo "🌐 Building web frontend..."
cd "$WEB_DIR"
pnpm install
pnpm build

# Go back to Tauri directory
cd "$TAURI_DIR"

# Build Tauri application
echo "🔨 Building Tauri application..."

BUILD_ARGS=""
if [ -n "$TARGET" ]; then
  BUILD_ARGS="--target $TARGET"
  echo "🎯 Target: $TARGET"
fi

if [ "$RELEASE" = true ]; then
  echo "🏗️ Building in release mode..."
  pnpm tauri build $BUILD_ARGS
else
  echo "🏗️ Building in debug mode..."
  pnpm tauri build --debug $BUILD_ARGS
fi

echo "✅ Build completed successfully!"

# Show build artifacts
echo ""
echo "📦 Build artifacts:"
if [ "$RELEASE" = true ]; then
  find src-tauri/target -name "*.dmg" -o -name "*.msi" -o -name "*.AppImage" -o -name "*.deb" | sort
else
  find src-tauri/target -path "*/debug/*" -name "*noteum*" -type f | head -5
fi