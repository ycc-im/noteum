import type { Preview } from '@storybook/react'
import React from 'react'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#09090b',
        },
      ],
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'click-order',
            enabled: true,
          },
        ],
      },
    },
    options: {
      storySort: {
        order: ['UI', ['Button', 'Dialog', 'RadioGroup', 'Checkbox']],
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const { theme } = context.globals
      const isDark = theme === 'dark'

      if (typeof document !== 'undefined') {
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }

      return React.createElement(
        'div',
        { className: isDark ? 'dark' : '' },
        React.createElement(
          'div',
          { className: 'min-h-screen bg-background text-foreground p-4' },
          React.createElement(Story)
        )
      )
    },
  ],
}

export default preview
