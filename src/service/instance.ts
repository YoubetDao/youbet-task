import axios from 'axios'
import qs from 'qs'
import { store, tokenAtom, usernameAtom, userRoleAtom } from '@/store'
import { toast } from '@/components/ui/use-toast'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'comma' })
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = store.get(tokenAtom)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    // if (config.url && config.method?.toLocaleUpperCase() === 'GET') {
    //   const u = new URL(window.location.origin + config.url)
    //   const searchParams = u.searchParams
    //   // add timestamp to prevent caching
    //   searchParams.append('t', String(Date.now()))
    //   config.url = u.pathname + searchParams.toString()
    // }
    const namespace = import.meta.env.VITE_API_NAMESPACE
    config.params = { ...config.params, ...(namespace ? { namespace } : {}) }
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      const messages = response.data.messages || ['got errors']
      return Promise.reject({ messages })
    }
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        // Unauthorized: clear token and redirect to login
        // Cookies.remove('token') // Remove token from cookie
        // Cookies.remove('username')
        store.set(tokenAtom, null)
        store.set(usernameAtom, null)
        // history.replace('/login') // Redirect to login page
        const pathname = window.location.pathname
        window.location.href = `/login?redirect_uri=${encodeURIComponent(pathname)}`
      } else if (status === 403) {
        store.set(userRoleAtom, null)
        window.location.href = '/'
        toast({
          title: 'Forbidden',
          description: 'Permission denied. Please contact admin.',
        })
      } else if (status >= 400 && status <= 599) {
        // Internal Server Error: return the error response
        toast({
          variant: 'destructive',
          title: 'Internal Server Error:',
          description:
            typeof error.response.data.message === 'string'
              ? error.response.data.message
              : JSON.stringify(error.response.data.message),
        })
        return Promise.reject(error.response)
      }
    }
    return Promise.reject(error)
  },
)

const http = instance

export default http
