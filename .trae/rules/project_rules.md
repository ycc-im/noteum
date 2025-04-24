# 项目规范指南

本文档为项目规范的引导文档，详细的规范文档请参考 `.llmrules` 目录。

## 规范文档目录

所有项目规范文档都位于 `.llmrules/docs` 目录下：

- [项目结构规范](../../.llmrules/docs/project-structure.mdc)
- [代码风格规范](../../.llmrules/docs/code-style.mdc)
- [组件开发规范](../../.llmrules/docs/component.mdc)
- [数据模型规范](../../.llmrules/docs/data-model.mdc)
- [API 接口规范](../../.llmrules/docs/api.mdc)
- [测试规范](../../.llmrules/docs/testing.mdc)
- [文档编写规范](../../.llmrules/docs/documentation.mdc)
- [Git 工作流规范](../../.llmrules/docs/git-workflow.mdc)
- [UI/UX 设计规范](../../.llmrules/docs/ui-ux.mdc)
- [编程语言规范](../../.llmrules/docs/language.mdc)

## 规范配置

项目使用了多个 AI 助手工具来协助开发，它们都继承了 `.llmrules` 中定义的规范：

- Windsurf AI：用于代码生成和规范检查
- Cline AI：用于代码重构和类型安全
- Cursor AI：用于实时编码辅助和建议

这些工具的配置文件分别是：
- `.windsurfrules`
- `.clinerules`
- `.cursorrules`

## 规范执行

所有规范都通过工具和 CI/CD 流程强制执行，确保代码质量和一致性：

1. 提交前检查：使用 husky 进行 pre-commit 和 pre-push 检查
2. CI 检查：通过 GitHub Actions 进行自动化检查
3. 编辑器集成：IDE 插件提供实时提示和修复建议

## 规范更新

如需更新规范，请遵循以下步骤：

1. 在 `.llmrules/docs` 中修改相应的规范文档
2. 更新 `.llmrules/config/mdc.yaml` 配置
3. 提交变更并创建 Pull Request
4. 等待团队审核通过后合并