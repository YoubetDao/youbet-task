import { backendUrl } from '@/constants/config'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Callback = () => {
  const location = useLocation()
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')

    if (code) {
      fetch(`http://${backendUrl}/auth/github/callback?code=${code}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('User info:', data)
          // 在此处处理用户信息，例如保存到状态或重定向到其他页面
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
