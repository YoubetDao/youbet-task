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
        return response.data.data // 返回 JWT
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
