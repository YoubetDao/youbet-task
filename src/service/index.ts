import { Project, Task } from '@/types'
import http from './instance'
import { FetchIssuesParams, Profile, } from '@/types'

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
  fetchTasks: async (params: FetchIssuesParams): Promise<Task[] | null> => {
    try {
      const response = await http.get('/tasks', {
        params,
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
  fetchProjects: async (): Promise<Project[] | null> => {
    try {
      const response = await http.get('/projects')
      if (response.data) {
        return response.data
      }
    } catch (error) {
      console.log('Error fetching projects:', error)
    }
    return null
  },
  fetchLeaderboard: async (): Promise<Profile[] | null> => {
    try {
      const response = await http.get('/leaderboard')

      if (response.data) {
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return null
    }
  },
}

export default api
