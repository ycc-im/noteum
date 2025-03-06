import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { createFileRoute, Link } from '@tanstack/react-router'
// @ts-expect-error - Type definitions conflict with TypeScript version
export const Route = createFileRoute('/')({
  component: IndexComponent,
})
function IndexComponent() {
  return _jsxs('div', {
    className: `p-2`,
    children: [
      _jsx('div', { className: `text-lg`, children: 'Welcome Home!' }),
      _jsx('hr', { className: `my-2` }),
      _jsx(Link, {
        to: '/dashboard/posts/$postId',
        params: {
          postId: '3',
        },
        className: `py-1 px-2 text-xs bg-blue-500 text-white rounded-full`,
        children: '1 New Invoice',
      }),
      _jsx('hr', { className: `my-2` }),
      _jsxs('div', {
        className: `max-w-xl`,
        children: [
          'As you navigate around take note of the UX. It should feel suspense-like, where routes are only rendered once all of their data and elements are ready.',
          _jsx('hr', { className: `my-2` }),
          'To exaggerate async effects, play with the artificial request delay slider in the bottom-left corner.',
          _jsx('hr', { className: `my-2` }),
          'The last 2 sliders determine if link-hover preloading is enabled (and how long those preloads stick around) and also whether to cache rendered route data (and for how long). Both of these default to 0 (or off).',
        ],
      }),
    ],
  })
}
