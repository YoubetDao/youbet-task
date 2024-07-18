import axios from 'axios'
import qs from 'qs'
import { createBrowserHistory } from 'history'
import Cookies from 'js-cookie'
import { backendUrl } from '@/constants/config'

const history = createBrowserHistory()

const instance = axios.create({
  baseURL: `http://${backendUrl}`,
  paramsSerializer(params) {
    return qs.stringify(params, { indices: false })
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Accept = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
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
        Cookies.remove('token') // Remove token from cookie
        Cookies.remove('username')
        history.replace('/login') // Redirect to login page
      } else if (status === 403) {
        // Forbidden: clear token and redirect to login
        Cookies.remove('token') // Remove token from cookie
        Cookies.remove('username')
        history.replace('/login') // Redirect to login page
      } else if (status === 500) {
        // Internal Server Error: return the error response
        return Promise.reject(error.response)
      }
    }
    return Promise.reject(error)
  },
)

const http = instance

export default http
