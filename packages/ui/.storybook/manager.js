import { addons } from '@storybook/manager-api'

// 禁用遥测
if (window.localStorage) {
  window.localStorage.setItem('storybook-telemetry', 'false')
}

addons.setConfig({
  // 其他配置
  sidebar: {
    showRoots: true,
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
})
