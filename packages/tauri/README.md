# Noteum Desktop App (Tauri)

Noteum 桌面应用程序，基于 Tauri 构建，支持 Windows、macOS 和 Linux 平台。

## 系统要求

### 开发环境

- **Node.js**: v18 或更高版本
- **pnpm**: v8 或更高版本  
- **Rust**: 1.75 或更高版本
- **Tauri CLI**: 自动通过 package.json 安装

### 平台特定要求

#### Windows
- Visual Studio Build Tools 2019 或更高版本
- WebView2 运行时 (通常已预装在 Windows 10/11)

#### macOS
- Xcode Command Line Tools
- macOS 10.15 (Catalina) 或更高版本

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y \
  libgtk-3-dev \
  libwebkit2gtk-4.0-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf
```

## 快速开始

### 开发模式

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

这会同时启动 Web 前端和 Tauri 开发服务器。

### 构建生产版本

#### 使用 npm 脚本
```bash
# 构建桌面应用
pnpm build

# 仅构建 web 前端
cd ../web && pnpm build
```

#### 使用构建脚本

**Linux/macOS:**
```bash
# 基本构建
./scripts/build.sh

# 发布模式构建
./scripts/build.sh --release

# 指定目标平台
./scripts/build.sh --target x86_64-apple-darwin --release

# 清理构建
./scripts/build.sh --clean --release
```

**Windows (PowerShell):**
```powershell
# 基本构建
.\scripts\build-windows.ps1

# 发布模式构建
.\scripts\build-windows.ps1 -Release

# 指定目标平台
.\scripts\build-windows.ps1 -Target "x86_64-pc-windows-msvc" -Release

# 清理构建
.\scripts\build-windows.ps1 -Clean -Release
```

## 项目结构

```
packages/tauri/
├── src/                    # 前端 TypeScript 代码
│   └── main.ts            # Tauri API 封装
├── src-tauri/             # Tauri Rust 后端
│   ├── src/
│   │   └── main.rs        # Rust 主入口
│   ├── Cargo.toml         # Rust 依赖配置
│   ├── tauri.conf.json    # Tauri 应用配置
│   └── build.rs           # 构建脚本
├── scripts/               # 构建脚本
│   ├── build.sh          # Linux/macOS 构建脚本
│   └── build-windows.ps1 # Windows 构建脚本
└── package.json          # Node.js 依赖和脚本
```

## 配置

### Tauri 配置 (tauri.conf.json)

主要配置项：
- `build.devPath`: 开发模式下的前端路径 (http://localhost:3000)
- `build.distDir`: 生产构建时的前端目录 (../web/dist)
- `package`: 应用包信息
- `tauri.allowlist`: API 权限配置
- `tauri.windows`: 窗口配置

### API 权限

当前启用的 API 权限：
- **File System**: 文件读写操作
- **Dialog**: 文件对话框
- **Window**: 窗口管理
- **Shell**: 打开外部链接

## 开发

### 添加新的 Tauri 命令

1. 在 `src-tauri/src/main.rs` 中定义命令：
```rust
#[tauri::command]
async fn my_command(param: String) -> Result<String, String> {
    Ok(format!("Hello {}", param))
}
```

2. 注册命令：
```rust
.invoke_handler(tauri::generate_handler![
    // ... 其他命令
    my_command
])
```

3. 在 `src/main.ts` 中添加 TypeScript 封装：
```typescript
static async myCommand(param: string): Promise<string> {
  return await invoke('my_command', { param });
}
```

### 调试

#### Rust 后端调试
```bash
# 查看 Rust 日志
RUST_LOG=debug pnpm dev
```

#### 前端调试
- 开发模式下自动打开 Chrome DevTools
- 生产模式下可通过菜单 -> View -> Toggle Developer Tools

## 构建产物

### 开发构建
- 位置: `src-tauri/target/debug/`
- 文件: 可执行文件 (未优化)

### 发布构建
- **Windows**: `src-tauri/target/release/bundle/msi/Noteum_*.msi`
- **macOS**: `src-tauri/target/release/bundle/dmg/Noteum_*.dmg`  
- **Linux**: `src-tauri/target/release/bundle/deb/noteum_*.deb` 或 `*.AppImage`

## CI/CD

GitHub Actions 自动构建配置：
- **构建流水线**: `.github/workflows/build.yml`
- **发布流水线**: `.github/workflows/release.yml`

支持的平台：
- Windows (x86_64)
- macOS (x86_64, Apple Silicon)
- Linux (x86_64)

## 故障排除

### 常见问题

1. **构建失败 - 缺少系统依赖**
   - 确保安装了平台特定的系统依赖
   - Linux: 检查 GTK 和 WebKit 库
   - Windows: 检查 Visual Studio Build Tools

2. **前端资源未找到**
   - 确保 web 包已构建：`cd ../web && pnpm build`
   - 检查 `tauri.conf.json` 中的 `distDir` 路径

3. **开发模式端口冲突**
   - 修改 web 包的端口配置
   - 更新 `tauri.conf.json` 中的 `devPath`

4. **Rust 编译错误**
   - 更新 Rust: `rustup update`
   - 清理构建缓存: `./scripts/build.sh --clean`

### 日志和调试

- Rust 日志: 设置 `RUST_LOG=debug`
- Tauri 日志: 查看控制台输出
- 前端日志: 开发者工具控制台

## 相关链接

- [Tauri 文档](https://tauri.app/)
- [Tauri API 参考](https://tauri.app/v1/api/js/)
- [Rust 文档](https://doc.rust-lang.org/)