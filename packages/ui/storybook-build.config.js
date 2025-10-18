const config = {
  // 构建输出目录
  outputDir: 'storybook-static',

  // 静态文件配置
  staticDir: ['../public'],

  // 构建优化
  managerCache: true,

  // 环境变量
  env: (config) => ({
    ...config,
    NODE_ENV: 'production',
  }),

  // 构建配置
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // 核心配置
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],

  // 包配置
  features: {
    buildStoriesJson: true,
    storyStoreV7: true,
  },
}

module.exports = config
