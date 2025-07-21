import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToken, useUserPermission, UserPermission } from '@/store'

interface AuthWrapperProps {
  children: React.ReactNode
  requireAuth?: boolean
  requirePermissions?: UserPermission[]
  redirectTo?: string
}

export default function AuthWrapper({
  children,
  requireAuth = false,
  requirePermissions,
  redirectTo = '/login',
}: AuthWrapperProps) {
  const navigate = useNavigate()
  const [token] = useToken()
  const [userPermission] = useUserPermission()

  useEffect(() => {
    // 需要登录但未登录
    if (requireAuth && !token) {
      navigate(redirectTo, { replace: true })
      return
    }

    // 需要特定权限但权限不足
    if (requirePermissions && requirePermissions.length > 0) {
      const hasPermission = requirePermissions.some(
        (permission) => userPermission === permission || userPermission === UserPermission.All,
      )

      if (!hasPermission) {
        navigate('/dashboard', { replace: true }) // 重定向到仪表板
        return
      }
    }
  }, [token, userPermission, requireAuth, requirePermissions, navigate, redirectTo])

  // 如果需要登录但未登录，不渲染子组件
  if (requireAuth && !token) {
    return null
  }

  // 如果需要权限但权限不足，不渲染子组件
  if (requirePermissions && requirePermissions.length > 0) {
    const hasPermission = requirePermissions.some(
      (permission) => userPermission === permission || userPermission === UserPermission.All,
    )
    if (!hasPermission) {
      return null
    }
  }

  return <>{children}</>
}
