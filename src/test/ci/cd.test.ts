/**
 * TDD CI/CD 流程验证测试
 *
 * 这个测试文件用于验证CI/CD流水线的各个组件是否正常工作
 * 包括：Jest配置、代码覆盖率、ESLint、Prettier等
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('TDD CI/CD Pipeline Validation', () => {
  describe('Jest Configuration', () => {
    it('should have correct Jest configuration', () => {
      // 验证Jest配置是否存在且正确
      const jestConfig = require('../../../jest.config.cjs');

      expect(jestConfig).toBeDefined();
      expect(jestConfig.preset).toBe('ts-jest/presets/default-esm');
      expect(jestConfig.testEnvironment).toBe('jsdom');
      expect(jestConfig.coverageThreshold).toBeDefined();
      expect(jestConfig.coverageThreshold.global.lines).toBe(90);
      expect(jestConfig.coverageThreshold.global.functions).toBe(90);
      expect(jestConfig.coverageThreshold.global.branches).toBe(90);
      expect(jestConfig.coverageThreshold.global.statements).toBe(90);
    });

    it('should have correct module mapping', () => {
      const jestConfig = require('../../../jest.config.cjs');

      expect(jestConfig.moduleNameMapper).toBeDefined();
      expect(jestConfig.moduleNameMapper['^@/(.*)$']).toBe('<rootDir>/src/$1');
      expect(jestConfig.moduleNameMapper['^@components/(.*)$']).toBe('<rootDir>/src/components/$1');
      expect(jestConfig.moduleNameMapper['^@services/(.*)$']).toBe('<rootDir>/src/services/$1');
    });

    it('should have correct test match patterns', () => {
      const jestConfig = require('../../../jest.config.cjs');

      expect(jestConfig.testMatch).toBeDefined();
      expect(Array.isArray(jestConfig.testMatch)).toBe(true);
      expect(jestConfig.testMatch.length).toBeGreaterThan(0);
    });
  });

  describe('Package.json Scripts', () => {
    let packageJson: any;

    beforeAll(() => {
      packageJson = require('../../../package.json');
    });

    it('should have TDD-related scripts', () => {
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts['test:tdd']).toBeDefined();
      expect(packageJson.scripts['test:unit']).toBeDefined();
      expect(packageJson.scripts['test:integration']).toBeDefined();
      expect(packageJson.scripts['test:performance']).toBeDefined();
      expect(packageJson.scripts['test:coverage']).toBeDefined();
    });

    it('should have quality check scripts', () => {
      expect(packageJson.scripts['lint']).toBeDefined();
      expect(packageJson.scripts['format']).toBeDefined();
      expect(packageJson.scripts['typecheck']).toBeDefined();
    });

    it('should have Jest test scripts', () => {
      expect(packageJson.scripts['test:jest']).toBeDefined();
      expect(packageJson.scripts['test:jest:coverage']).toBeDefined();
    });
  });

  describe('ESLint Configuration', () => {
    it('should have ESLint configuration', () => {
      const eslintConfig = require('../../../.eslintrc.js');

      expect(eslintConfig).toBeDefined();
      expect(eslintConfig.root).toBe(true);
      expect(eslintConfig.parser).toBe('@typescript-eslint/parser');
      expect(eslintConfig.extends).toBeDefined();
      expect(Array.isArray(eslintConfig.extends)).toBe(true);
    });

    it('should have TypeScript ESLint rules', () => {
      const eslintConfig = require('../../../.eslintrc.js');

      expect(eslintConfig.parserOptions).toBeDefined();
      expect(eslintConfig.parserOptions.project).toBe('./tsconfig.json');
    });
  });

  describe('Prettier Configuration', () => {
    it('should have Prettier configuration', () => {
      const prettierConfig = require('../../../.prettierrc');

      expect(prettierConfig).toBeDefined();
      expect(prettierConfig.semi).toBe(true);
      expect(prettierConfig.singleQuote).toBe(true);
      expect(prettierConfig.tabWidth).toBe(2);
      expect(prettierConfig.trailingComma).toBe('es5');
    });

    it('should have Prettier ignore file', () => {
      const fs = require('fs');
      const path = require('path');

      const prettierIgnorePath = path.join(__dirname, '../../../.prettierignore');
      const prettierIgnoreExists = fs.existsSync(prettierIgnorePath);

      expect(prettierIgnoreExists).toBe(true);
    });
  });

  describe('GitHub Actions Workflows', () => {
    it('should have TDD workflow file', () => {
      const fs = require('fs');
      const path = require('path');

      const tddWorkflowPath = path.join(__dirname, '../../../.github/workflows/tdd.yml');
      const tddWorkflowExists = fs.existsSync(tddWorkflowPath);

      expect(tddWorkflowExists).toBe(true);
    });

    it('should have existing build workflow', () => {
      const fs = require('fs');
      const path = require('path');

      const buildWorkflowPath = path.join(__dirname, '../../../.github/workflows/build.yml');
      const buildWorkflowExists = fs.existsSync(buildWorkflowPath);

      expect(buildWorkflowExists).toBe(true);
    });

    it('should have release workflow', () => {
      const fs = require('fs');
      const path = require('path');

      const releaseWorkflowPath = path.join(__dirname, '../../../.github/workflows/release.yml');
      const releaseWorkflowExists = fs.existsSync(releaseWorkflowPath);

      expect(releaseWorkflowExists).toBe(true);
    });
  });

  describe('Dependencies Check', () => {
    let packageJson: any;

    beforeAll(() => {
      packageJson = require('../../../package.json');
    });

    it('should have Jest dependencies', () => {
      expect(packageJson.devDependencies['jest']).toBeDefined();
      expect(packageJson.devDependencies['@types/jest']).toBeDefined();
      expect(packageJson.devDependencies['ts-jest']).toBeDefined();
    });

    it('should have testing library dependencies', () => {
      expect(packageJson.devDependencies['@testing-library/react']).toBeDefined();
      expect(packageJson.devDependencies['@testing-library/dom']).toBeDefined();
    });

    it('should have code quality dependencies', () => {
      expect(packageJson.devDependencies['eslint']).toBeDefined();
      expect(packageJson.devDependencies['prettier']).toBeDefined();
      expect(packageJson.devDependencies['@typescript-eslint/parser']).toBeDefined();
    });

    it('should have jsdom for testing environment', () => {
      expect(packageJson.devDependencies['jsdom']).toBeDefined();
    });
  });

  describe('CI/CD Integration Tests', () => {
    it('should validate TDD workflow structure', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');

      const tddWorkflowPath = path.join(__dirname, '../../../.github/workflows/tdd.yml');
      const tddWorkflowContent = fs.readFileSync(tddWorkflowPath, 'utf8');
      const tddWorkflow = yaml.load(tddWorkflowContent);

      expect(tddWorkflow.name).toBe('TDD Pipeline');
      expect(tddWorkflow.on).toBeDefined();
      expect(tddWorkflow.on.push).toBeDefined();
      expect(tddWorkflow.on.pull_request).toBeDefined();
      expect(tddWorkflow.jobs).toBeDefined();
      expect(tddWorkflow.jobs.test).toBeDefined();
      expect(tddWorkflow.jobs.quality).toBeDefined();
    });

    it('should have multi-node version testing', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');

      const tddWorkflowPath = path.join(__dirname, '../../../.github/workflows/tdd.yml');
      const tddWorkflowContent = fs.readFileSync(tddWorkflowPath, 'utf8');
      const tddWorkflow = yaml.load(tddWorkflowContent);

      const testJob = tddWorkflow.jobs.test;
      expect(testJob.strategy).toBeDefined();
      expect(testJob.strategy.matrix).toBeDefined();
      expect(testJob.strategy.matrix['node-version']).toBeDefined();
      expect(testJob.strategy.matrix['node-version']).toContain('18.x');
      expect(testJob.strategy.matrix['node-version']).toContain('20.x');
    });

    it('should have code coverage upload', () => {
      const fs = require('fs');
      const path = require('path');
      const yaml = require('js-yaml');

      const tddWorkflowPath = path.join(__dirname, '../../../.github/workflows/tdd.yml');
      const tddWorkflowContent = fs.readFileSync(tddWorkflowPath, 'utf8');
      const tddWorkflow = yaml.load(tddWorkflowContent);

      const testJob = tddWorkflow.jobs.test;
      const codecovStep = testJob.steps.find((step: any) => step.uses?.includes('codecov'));
      expect(codecovStep).toBeDefined();
    });
  });

  describe('Test Environment Setup', () => {
    it('should have test setup file', () => {
      const fs = require('fs');
      const path = require('path');

      const setupPath = path.join(__dirname, '../../setup.ts');
      const setupExists = fs.existsSync(setupPath);

      expect(setupExists).toBe(true);
    });

    it('should be able to import test utilities', () => {
      // 验证测试环境设置正确
      expect(global.describe).toBeDefined();
      expect(global.it).toBeDefined();
      expect(global.expect).toBeDefined();
      expect(global.beforeAll).toBeDefined();
      expect(global.afterAll).toBeDefined();
    });
  });

  describe('Coverage Configuration', () => {
    it('should have correct coverage collection', () => {
      const jestConfig = require('../../../jest.config.cjs');

      expect(jestConfig.collectCoverageFrom).toBeDefined();
      expect(Array.isArray(jestConfig.collectCoverageFrom)).toBe(true);
      expect(jestConfig.collectCoverageFrom).toContain('src/**/*.{ts,tsx}');
      expect(jestConfig.collectCoverageFrom).toContain('!src/**/*.d.ts');
      expect(jestConfig.collectCoverageFrom).toContain('!src/**/*.test.{ts,tsx}');
    });

    it('should have coverage reporters', () => {
      const jestConfig = require('../../../jest.config.cjs');

      expect(jestConfig.coverageReporters).toBeDefined();
      expect(Array.isArray(jestConfig.coverageReporters)).toBe(true);
      expect(jestConfig.coverageReporters).toContain('text');
      expect(jestConfig.coverageReporters).toContain('lcov');
      expect(jestConfig.coverageReporters).toContain('html');
      expect(jestConfig.coverageReporters).toContain('json-summary');
    });
  });
});