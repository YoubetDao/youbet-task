import { backendUrl } from '@/constants/config'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

const Callback = () => {
  const location = useLocation()
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')

    if (code) {
      fetch(`http://${backendUrl}/auth/github/callback?code=${code}`)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          console.log('User info:', data)
          if (data.data.jwt) {
            Cookies.set('token', data.data.jwt, { expires: 7 }) // 7 天过期
          }
          console.log(data.data.jwt)
        })
        .catch((error) => {
          console.error('Error fetching user info:', error)
        })
    }
  })

  return (
    <div>
      <p>Redirecting...5s后自动跳转回去</p>
    </div>
  )
}

export default Callback
