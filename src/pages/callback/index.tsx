import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '@/service'

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
    <div>
      <p>Redirecting...</p>
    </div>
  )
}

export default Callback
