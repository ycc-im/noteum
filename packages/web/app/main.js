import { jsx as _jsx } from 'react/jsx-runtime'
/// <reference types="vinxi/types/client" />
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './styles.css'
import { createRouter } from './router'
// Set up a Router instance
const router = createRouter()
const rootElement = document.getElementById('root')
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(_jsx(React.StrictMode, { children: _jsx(RouterProvider, { router: router }) }))
}
