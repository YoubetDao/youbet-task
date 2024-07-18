import React from 'react'
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'

import { navItems } from '@/constants/data'
import { Pages } from '@/router/pages'
import { Layouts } from '@/router/layouts'
import { Helmet } from 'react-helmet'
import Cookies from 'js-cookie'

const getDefaultLayout = ({ children }: { children: React.ReactNode }) => children

const routerObjects: RouteObject[] = navItems.map((item) => {
  const Page = Pages[item.component]
  const Layout = item.layout ? Layouts[item.layout] : getDefaultLayout
  // 设置 `private` 属性的默认值
  const isPrivate = item.component !== 'callback' && item.component !== 'login'

  const Component = () => {
    const token = Cookies.get('token')
    return (
      <>
        <Helmet>
          <title>{item.title} - YouBet Task</title>
          {item.description && <meta name="description" content={item.description} />}
        </Helmet>
        <Layout>{isPrivate && !token ? <Navigate to="/login" replace /> : <Page />}</Layout>
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
    const page = Component ? <Component /> : null
    return {
      ...router,
      element: page,
      Component: null,
      // ErrorBoundary: ErrorPage,
    }
  })
  return createBrowserRouter(routeWrappers)
}
