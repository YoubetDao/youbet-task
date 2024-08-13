import { Task } from '@/types'
import http from './instance'

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
  fetchTasks: async (org: string, project: string): Promise<Task[] | null> => {
    try {
      const response = await http.get('/tasks', {
        params: { org, project },
      })
      console.log(response.data)

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
