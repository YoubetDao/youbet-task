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

const routerObjects: RouteObject[] = navItems.map((item) => {
  const Page = Pages[item.component]
  const Layout = item.layout ? Layouts[item.layout] : getDefaultLayout
  // 设置 `private` 属性的默认值
  // const isPrivate = item.component !== 'callback' && item.component !== 'login'

  const Component = () => {
    // const [token] = useAtom(tokenAtom)

    return (
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
  }

  return {
    path: item.href,
    Component,
  }
})

export function createRouter(): ReturnType<typeof createBrowserRouter> {
  const routeWrappers = routerObjects.map((router) => {
    const Component = router.Component
    const page = Component ? (
      <>
        <PageTracker />
        <Component />
      </>
    ) : null
    return {
      ...router,
      element: page,
      Component: null,
      ErrorBoundary: Pages.error,
    }
  })
  return createBrowserRouter(routeWrappers)
}
