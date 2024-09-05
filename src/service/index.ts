import { Project, Task, FetchIssuesParams, Profile } from '@/types'
import http from './instance'

export async function fetchUserInfo(code: string) {
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
}

export async function fetchTask(githubId: string) {
  try {
    const response = await http.get(`/task/${githubId}`)

    if (response.data) {
      return response.data as Task
    }

    return null
  } catch (error) {
    console.error('Error fetching task info:', error)
    return null
  }
}

export async function fetchTasks(params: FetchIssuesParams) {
  try {
    const response = await http.get('/tasks', {
      params,
    })

    if (response.data && response.data.data) {
      return response.data.data as Task[]
    }
    return null
  } catch (error) {
    console.error('Error fetching user info:', error)
    return null
  }
}

export async function fetchProjects() {
  try {
    const response = await http.get('/projects?limit=1000')
    if (response.data && response.data.data) {
      return response.data.data as Project[]
    }
  } catch (error) {
    console.log('Error fetching projects:', error)
  }
  return null
}

export async function fetchLeaderboard(): Promise<{ data: Profile[]; totalCount: number }> {
  try {
    const response = await http.get('/leaderboard?limit=5')

    if (response.data) {
      return {
        data: response.data.data,
        totalCount: response.data.pagination.totalCount,
      }
    }

    return { data: [], totalCount: 0 }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return { data: [], totalCount: 0 }
  }
}

export async function fetchTutorialContent(githubId: string) {
  try {
    const response = await http.get('/tutorial/' + githubId)

    if (response.data) {
      return response.data
    }
    return ''
  } catch (error) {
    console.error('Error fetching tutorial content:', error)
    return ''
  }
}
