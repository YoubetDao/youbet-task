import axios from 'axios'
import qs from 'qs'
import { getToken, updateToken, updateUsername } from '@/store'
import { toast } from '@/components/ui/use-toast'

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'comma' })
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    const namespace = import.meta.env.VITE_API_NAMESPACE
    config.params = { ...config.params, ...(namespace ? { namespace } : {}) }
    if (config.method?.toLowerCase() !== 'get' && namespace && config.headers['Content-Type'] === 'application/json') {
      const body = config.data || {}
      config.data = typeof body === 'string' ? { ...JSON.parse(body), namespace } : { ...body, namespace }
    }
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
        updateToken(null)
        updateUsername(null)
        const pathname = window.location.pathname
        window.location.href = `/login?redirect_uri=${encodeURIComponent(pathname)}`
      } else if (status === 403) {
        window.location.href = '/'

        toast({
          title: 'Forbidden',
          description: 'Permission denied. Please contact admin.',
        })
      } else if (status >= 400 && status <= 599) {
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
