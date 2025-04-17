import { UserApi, Configuration } from '@/openapi/client'

import { getToken } from '@/store'

export const userApi = new UserApi(
  new Configuration({
    basePath: import.meta.env.VITE_BASE_URL,
    accessToken: getToken() ?? '',
  }),
)
