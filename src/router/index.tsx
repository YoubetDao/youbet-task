import React from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'

import { navItems } from '@/constants/data'
import { Pages } from '@/router/pages'
import { Layouts } from '@/router/layouts'
import { Helmet } from 'react-helmet'

const getDefaultLayout = ({ children }: { children: React.ReactNode }) => children

const routerObjects: RouteObject[] = navItems.map((item) => {
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
  return {
    path: item.href,
    Component,
  }
})

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
