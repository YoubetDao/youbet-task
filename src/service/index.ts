import Cookies from 'js-cookie'
import http from './instance'
import { Issue } from '@/types'

const api = {
  fetchUserInfo: async (code: string) => {
    try {
      const response = await http.get('/auth/github/callback', {
        params: { code },
      })

      console.log('User info:', response.data)
      if (response.data.data && response.data.data.jwt) {
        Cookies.set('token', response.data.data.jwt, { expires: 1 }) // 设置 token 到 cookie
        Cookies.set('username', response.data.data.username, { expires: 1 })
        return response.data.data.jwt // 返回 JWT
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  },
  fetchIssues: async (org: string, project: string): Promise<Issue[] | null> => {
    try {
      const response = await http.get('/tasks', {
        params: { org, project },
      })

      if (response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching user info:', error)
      return null
    }
  },
}

export default api
