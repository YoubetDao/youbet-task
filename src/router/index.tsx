import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'

import { getNavItems } from '@/constants/data'
import { Pages } from '@/router/pages'
import { Layouts } from '@/router/layouts'
import { Helmet } from 'react-helmet'
import { usePageTracking } from '@/hooks/use-page-tracking'
import { useTimeTracking } from '@/hooks/use-time-tracking'
import { NavItem } from '@/types'
import { BRAND_NAME } from '@/lib/config'

function PageTracker() {
  usePageTracking()
  useTimeTracking()
  return null
}

const getDefaultLayout = ({ children }: { children: React.ReactNode }) => children

const createRouterObjects = (items: NavItem[]): RouteObject[] => {
  const flattenRoutes: RouteObject[] = []

  items.forEach((item) => {
    const Page = Pages[item.component]
    const Layout = item.layout ? Layouts[item.layout] : getDefaultLayout

    const Component = () => (
      <>
        <Helmet>
          <title>
            {item.title} - {BRAND_NAME}
          </title>
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
  const navItems = getNavItems()
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
