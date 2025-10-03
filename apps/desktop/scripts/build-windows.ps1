# Tauri Windows build script
param(
    [string]$Target = "",
    [switch]$Release = $false,
    [switch]$Clean = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "Usage: .\build-windows.ps1 [OPTIONS]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Target TARGET    Rust target triple (e.g., x86_64-pc-windows-msvc)"
    Write-Host "  -Release         Build in release mode"
    Write-Host "  -Clean           Clean build artifacts before building"
    Write-Host "  -Help            Show this help message"
    exit 0
}

Write-Host "🚀 Starting Tauri build process..." -ForegroundColor Green

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path "$ScriptDir\..\..\..\"
$TauriDir = "$ProjectRoot\packages\tauri"
$WebDir = "$ProjectRoot\packages\web"

Write-Host "📁 Project structure:" -ForegroundColor Blue
Write-Host "  Root: $ProjectRoot"
Write-Host "  Web:  $WebDir"
Write-Host "  Tauri: $TauriDir"

# Check if we're in the right directory
if (!(Test-Path "$TauriDir\src-tauri\Cargo.toml")) {
    Write-Host "❌ Error: Tauri project not found at $TauriDir" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "$WebDir\package.json")) {
    Write-Host "❌ Error: Web project not found at $WebDir" -ForegroundColor Red
    exit 1
}

# Change to tauri directory
Set-Location $TauriDir

# Clean if requested
if ($Clean) {
    Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Yellow
    if (Test-Path "src-tauri\target") {
        Remove-Item -Recurse -Force "src-tauri\target"
    }
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
pnpm install

# Build web frontend first
Write-Host "🌐 Building web frontend..." -ForegroundColor Blue
Set-Location $WebDir
pnpm install
pnpm build

# Go back to Tauri directory
Set-Location $TauriDir

# Build Tauri application
Write-Host "🔨 Building Tauri application..." -ForegroundColor Blue

$BuildArgs = @()
if ($Target -ne "") {
    $BuildArgs += "--target"
    $BuildArgs += $Target
    Write-Host "🎯 Target: $Target" -ForegroundColor Yellow
}

if ($Release) {
    Write-Host "🏗️ Building in release mode..." -ForegroundColor Yellow
    pnpm tauri build @BuildArgs
} else {
    Write-Host "🏗️ Building in debug mode..." -ForegroundColor Yellow
    pnpm tauri build --debug @BuildArgs
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Show build artifacts
Write-Host ""
Write-Host "📦 Build artifacts:" -ForegroundColor Blue
if ($Release) {
    Get-ChildItem -Recurse src-tauri\target -Include "*.msi", "*.exe" | Sort-Object Name | Select-Object -Property Name, FullName
} else {
    Get-ChildItem -Recurse src-tauri\target\debug -Include "*noteum*" | Select-Object -First 5 -Property Name, FullName
}