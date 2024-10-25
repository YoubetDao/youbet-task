import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchUserInfo } from '@/service'
import Loading from '@/components/loading'
import { userPermissionAtom, store, tokenAtom, usernameAtom } from '@/store'
import { UserPermission } from '@/types'

const Callback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    const redirectUri = searchParams.get('redirect_uri')

    const handleFetchUserInfo = async (code: string) => {
      const userInfo = await fetchUserInfo(code)
      store.set(tokenAtom, userInfo.jwt)
      store.set(usernameAtom, userInfo.username)

      if (userInfo.adminNamespaces.length > 0 && userInfo.adminProjects.length > 0) {
        store.set(userPermissionAtom, UserPermission.All)
      } else if (userInfo.adminNamespaces.length > 0) {
        store.set(userPermissionAtom, UserPermission.PullRequest)
      } else if (userInfo.adminProjects.length > 0) {
        store.set(userPermissionAtom, UserPermission.TaskApplies)
      } else {
        store.set(userPermissionAtom, null)
      }

      navigate(redirectUri || '/')
    }

    if (code) handleFetchUserInfo(code)
  }, [searchParams, navigate])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Loading />
      <span>Redirecting</span>
    </div>
  )
}

export default Callback
