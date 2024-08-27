import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import { Provider } from 'jotai'
import { store } from './store'

// TODO: should be configured by the user
const eduChain = {
  id: 656476,
  name: 'EduChain',
  nativeCurrency: {
    name: 'EDU',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
      webSocket: ['wss://open-campus-codex-sepolia.drpc.org'],
    },
  },
}

const config = getDefaultConfig({
  appName: 'Kuibu',
  projectId: '05c3ea68819376e65dc4a8802f90f41b',
  chains: [eduChain],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])

  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={createRouter()} />
            <ReactQueryDevtools />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  )
}
