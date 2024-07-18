import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '@/service'
import Loading from '@/components/loading'

const Callback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')

    if (code) {
      api.fetchUserInfo(code).then(() => {
        navigate('/')
      })
    }
  }, [location, navigate])

  return (
    <div className="flex items-center justify-center h-screen w-screen flex-col">
      <Loading />
      <span>Redirecting</span>
    </div>
  )
}

export default Callback
