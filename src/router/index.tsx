import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'

import { navItems } from '@/constants/data'
import { Pages } from '@/router/pages'
import { Layouts } from '@/router/layouts'
import { Helmet } from 'react-helmet'
import { usePageTracking } from '@/hooks/use-page-tracking'
import { useTimeTracking } from '@/hooks/use-time-tracking'

function PageTracker() {
  usePageTracking()
  useTimeTracking()
  return null
}

const getDefaultLayout = ({ children }: { children: React.ReactNode }) => children

const createRouterObjects = (items: typeof navItems): RouteObject[] => {
  const flattenRoutes: RouteObject[] = []

  items.forEach((item) => {
    const Page = Pages[item.component]
    const Layout = item.layout ? Layouts[item.layout] : getDefaultLayout

    const Component = () => (
      <>
        <Helmet>
          <title>{item.title} - YouBet Task</title>
          {item.description && <meta name="description" content={item.description} />}
        </Helmet>
        <Layout>
          <Page />
        </Layout>
      </>
    )

    flattenRoutes.push({
      path: item.href,
      element: <Component />,
    })

    if (item.children) {
      flattenRoutes.push(...createRouterObjects(item.children))
    }
  })

  return flattenRoutes
}

export function createRouter(): ReturnType<typeof createBrowserRouter> {
  const routeObjects = createRouterObjects(navItems)

  const routeWrappers = routeObjects.map((router) => ({
    ...router,
    element: router.element ? (
      <>
        <PageTracker />
        {router.element}
      </>
    ) : null,
    ErrorBoundary: Pages.error,
  }))

  return createBrowserRouter(routeWrappers)
}
