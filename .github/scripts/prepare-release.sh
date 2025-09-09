#!/bin/bash
set -e

# Prepare release script for Tauri application
VERSION=${1:-"v1.0.0"}

echo "🚀 Preparing release $VERSION..."

# Remove 'v' prefix if present
VERSION_NUMBER=${VERSION#v}

echo "📦 Updating version numbers..."

# Update root package.json
if [ -f "package.json" ]; then
  echo "Updating root package.json to version $VERSION_NUMBER"
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION_NUMBER\"/" package.json
  rm package.json.bak 2>/dev/null || true
fi

# Update Tauri package.json
if [ -f "packages/tauri/package.json" ]; then
  echo "Updating packages/tauri/package.json to version $VERSION_NUMBER"
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION_NUMBER\"/" packages/tauri/package.json
  rm packages/tauri/package.json.bak 2>/dev/null || true
fi

# Update Tauri Cargo.toml
if [ -f "packages/tauri/src-tauri/Cargo.toml" ]; then
  echo "Updating packages/tauri/src-tauri/Cargo.toml to version $VERSION_NUMBER"
  sed -i.bak "s/version = \"[^\"]*\"/version = \"$VERSION_NUMBER\"/" packages/tauri/src-tauri/Cargo.toml
  rm packages/tauri/src-tauri/Cargo.toml.bak 2>/dev/null || true
fi

# Update Tauri config
if [ -f "packages/tauri/src-tauri/tauri.conf.json" ]; then
  echo "Updating packages/tauri/src-tauri/tauri.conf.json to version $VERSION_NUMBER"
  # Use a more robust JSON update approach
  if command -v jq &> /dev/null; then
    jq --arg version "$VERSION_NUMBER" '.package.version = $version' packages/tauri/src-tauri/tauri.conf.json > temp.json
    mv temp.json packages/tauri/src-tauri/tauri.conf.json
  else
    sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION_NUMBER\"/" packages/tauri/src-tauri/tauri.conf.json
    rm packages/tauri/src-tauri/tauri.conf.json.bak 2>/dev/null || true
  fi
fi

# Update web package.json if exists
if [ -f "packages/web/package.json" ]; then
  echo "Updating packages/web/package.json to version $VERSION_NUMBER"
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION_NUMBER\"/" packages/web/package.json || true
  rm packages/web/package.json.bak 2>/dev/null || true
fi

# Update server package.json if exists
if [ -f "packages/server/package.json" ]; then
  echo "Updating packages/server/package.json to version $VERSION_NUMBER"
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION_NUMBER\"/" packages/server/package.json || true
  rm packages/server/package.json.bak 2>/dev/null || true
fi

echo "📋 Generating release notes..."

# Create a simple release notes template
cat > RELEASE_NOTES.md << EOF
# Release $VERSION

## What's New

### Features
- Desktop application with Tauri
- Cross-platform support (Windows, macOS, Linux)
- AI-powered note-taking capabilities

### Improvements
- Enhanced performance and stability
- Better user experience
- Improved security

### Bug Fixes
- Various bug fixes and improvements

## Installation

### Desktop App
Download the appropriate installer for your platform from the Assets section below:
- **Windows**: \`.msi\` installer
- **macOS**: \`.dmg\` installer  
- **Linux**: \`.AppImage\` or \`.deb\` package

### System Requirements
- **Windows**: Windows 10 or later
- **macOS**: macOS 10.15 or later
- **Linux**: Modern Linux distribution with GTK3

## Changelog

For a complete list of changes, see the commit history.

---

**Full Changelog**: https://github.com/ycc-im/noteum/commits/$VERSION
EOF

echo "✨ Release preparation complete!"
echo "📄 Release notes template created in RELEASE_NOTES.md"
echo "🏷️  Version updated to: $VERSION_NUMBER"

# Display what was updated
echo ""
echo "📦 Updated files:"
[ -f "package.json" ] && echo "  - package.json"
[ -f "packages/tauri/package.json" ] && echo "  - packages/tauri/package.json"  
[ -f "packages/tauri/src-tauri/Cargo.toml" ] && echo "  - packages/tauri/src-tauri/Cargo.toml"
[ -f "packages/tauri/src-tauri/tauri.conf.json" ] && echo "  - packages/tauri/src-tauri/tauri.conf.json"
[ -f "packages/web/package.json" ] && echo "  - packages/web/package.json"
[ -f "packages/server/package.json" ] && echo "  - packages/server/package.json"

echo ""
echo "🎯 Ready for release build!"