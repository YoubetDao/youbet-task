import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import { scroll } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'Kuibu',
  projectId: '05c3ea68819376e65dc4a8802f90f41b',
  chains: [scroll],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={createRouter()} />
          <ReactQueryDevtools />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
