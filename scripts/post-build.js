#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const outputDir = '.output/public';
const assetsDir = path.join(outputDir, 'assets');

// 查找最新的 JS 和 CSS 文件
function findLatestFile(pattern) {
  try {
    const files = fs.readdirSync(assetsDir);
    const matchingFiles = files.filter(file => file.match(pattern));

    if (matchingFiles.length === 0) {
      throw new Error(`No files found matching pattern: ${pattern}`);
    }

    // 返回第一个匹配的文件（通常是最新的）
    return matchingFiles[0];
  } catch (error) {
    console.error('Error finding file:', error.message);
    return null;
  }
}

// 生成 index.html
function generateIndexHtml() {
  const jsFile = findLatestFile(/main-.*\.js$/);
  const cssFile = findLatestFile(/styles-.*\.css$/);

  if (!jsFile || !cssFile) {
    console.error('Could not find main JS or CSS files');
    process.exit(1);
  }

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Noteum</title>
  <link rel="stylesheet" href="./assets/${cssFile}">
</head>
<body>
  <div id="root">
    <div class="loading">
      <h1>Noteum</h1>
      <div class="spinner"></div>
      <p>Loading your notes...</p>
    </div>
  </div>
  <script type="module" src="./assets/${jsFile}"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading {
      text-align: center;
      color: white;
    }

    .loading h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }

    .loading p {
      font-size: 1.2rem;
      opacity: 0.8;
    }

    .loading .spinner {
      width: 40px;
      height: 40px;
      margin: 2rem auto;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
  console.log('✅ Generated index.html for Tauri');
}

// 运行脚本
generateIndexHtml();