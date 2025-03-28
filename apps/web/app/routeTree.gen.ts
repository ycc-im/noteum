/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as FlowImport } from './routes/flow'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const FlowRoute = FlowImport.update({
  id: '/flow',
  path: '/flow',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/flow': {
      id: '/flow'
      path: '/flow'
      fullPath: '/flow'
      preLoaderRoute: typeof FlowImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/flow': typeof FlowRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/flow': typeof FlowRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/flow': typeof FlowRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/flow'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/flow'
  id: '__root__' | '/' | '/flow'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  FlowRoute: typeof FlowRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  FlowRoute: FlowRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/flow"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/flow": {
      "filePath": "flow.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
