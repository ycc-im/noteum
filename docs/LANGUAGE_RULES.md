# Language Rules

This document outlines the language rules for the Noteum project.

## Default Language

The default language for communication in this project is Chinese (中文). This applies to:
- General communication
- Issue discussions
- Team meetings
- Documentation for internal use

## English Required Contexts

The following contexts MUST use English:

### 1. Pull Requests
- PR titles
- PR descriptions
- PR comments
- Code review comments

### 2. Code Related
- Code comments
- Variable names
- Function names
- Documentation strings
- API documentation
- Public documentation

### 3. Git Related
- Commit messages
- Branch names
- Tag names

## Rule Priority

1. Context-specific language requirements (as listed in "English Required Contexts") take precedence over the default language setting.
2. When in doubt, prefer English for any development-related content that might be read by non-Chinese speakers.

## Examples

### Good Examples

✅ Pull Request:
```
Title: feat(ui): add new Button component
Description: This PR adds a new reusable Button component...
```

✅ Code Comment:
```typescript
// Calculate the total amount including tax
function calculateTotal(price: number, taxRate: number): number
```

✅ Mixed Language in Issues:
```
问题描述：按钮点击无响应

Technical Analysis:
The button click event listener is not properly attached...

解决方案：
1. 添加事件监听器
2. 更新按钮状态
```

### Bad Examples

❌ Pull Request:
```
Title: 添加新的按钮组件
Description: 这个PR添加了一个新的可重用按钮组件...
```

❌ Code Comment:
```typescript
// 计算含税总额
function calculateTotal(price: number, taxRate: number): number
```

## Enforcement

- PR checks will enforce English usage in PR titles and descriptions
- Code reviews should include language compliance checks
- Automated tools may be used to verify code comment language in the future
