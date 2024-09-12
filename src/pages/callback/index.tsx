import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchUserInfo } from '@/service'
import Loading from '@/components/loading'
import { tokenAtom, usernameAtom } from '@/store'
import { useAtom } from 'jotai'

const Callback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [, setToken] = useAtom(tokenAtom)
  const [, setUsername] = useAtom(usernameAtom)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')

    if (code) {
      fetchUserInfo(code).then((data) => {
        setToken(data.jwt)
        setUsername(data.username)
        navigate('/')
      })
    }
  }, [location, navigate, setToken, setUsername])

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Loading />
      <span>Redirecting</span>
    </div>
  )
}

export default Callback
