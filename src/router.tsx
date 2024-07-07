import React from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import HomePage from './pages/home'

export const routerObjects: RouteObject[] = [
  {
    path: '/',
    Component: HomePage,
  },
]

export function createRouter(): ReturnType<typeof createHashRouter> {
  const routeWrappers = routerObjects.map((router) => {
    const Component = router.Component
    const page = Component ? <Component /> : null
    return {
      ...router,
      element: page,
      Component: null,
      // ErrorBoundary: ErrorPage,
    }
  })
  return createHashRouter(routeWrappers)
}
