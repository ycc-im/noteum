import type { Preview } from '@storybook/react'
import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        tablet: {
          name: 'Tablet', 
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
      },
      defaultViewport: 'desktop',
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
          value: '#333333',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div style={{ 
          width: '100%', 
          height: '600px',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
}

export default preview