import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const baseUrl = env.VITE_BASE_URL || '/api'
  const apiTarget = env.VITE_API_TARGET || 'http://43.132.156.239:5060'
  const baseUrlReg = new RegExp(`^${baseUrl}`)

  return {
    plugins: [
      svgr({
        exportAsDefault: true,
      }),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    server: {
      host: true,
      // TODO: port change to 9257
      port: 3000,
      proxy: {
        [baseUrl]: {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(baseUrlReg, ''),
        },
      },
    },
  }
})
