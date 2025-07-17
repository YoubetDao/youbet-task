import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import { Provider } from 'jotai'
import { store } from './store'
import ReactGA from 'react-ga4'
import { currentChain, paymentChain } from './constants/data'
import { base } from 'viem/chains'

const TRACKING_ID = 'G-S7DE4BCME4'
ReactGA.initialize(TRACKING_ID)

export const config = getDefaultConfig({
  appName: 'Kuibu',
  projectId: '05c3ea68819376e65dc4a8802f90f41b',
  chains: [currentChain, paymentChain, base],
  ssr: true,
})

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])

  return (
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  )
}
