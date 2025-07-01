import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '@/service'
import Loading from '@/components/loading'
import { useToken, useUsername, useUserPermission } from '@/store'
import { UserPermission } from '@/types'

const Callback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [, setToken] = useToken()
  const [, setUsername] = useUsername()
  const [, setUserPermission] = useUserPermission()

  useEffect(() => {
    const code = searchParams.get('code')
    let redirectUri = searchParams.get('redirect_uri')

    redirectUri = redirectUri !== '/' && redirectUri !== null ? redirectUri : '/dashboard'

    const handleFetchUserInfo = async (code: string) => {
      const userInfo = await authApi.authControllerGithubAuthRedirect(code).then((res) => res.data)
      setToken(userInfo.jwt)
      setUsername(userInfo.username)

      const getPermission = () => {
        const hasNamespaces = userInfo.adminNamespaces.length > 0
        const hasProjects = userInfo.adminProjects.length > 0

        if (hasNamespaces && hasProjects) return UserPermission.All
        if (hasNamespaces) return UserPermission.PullRequest
        if (hasProjects) return UserPermission.TaskApplies
        return null
      }

      setUserPermission(getPermission())

      navigate(redirectUri || '/dashboard')
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
