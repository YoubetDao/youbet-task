import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { clusterApiUrl } from '@solana/web3.js'
import '@rainbow-me/rainbowkit/styles.css'
import { Provider } from 'jotai'
import { store } from './store'
import ReactGA from 'react-ga4'
import { polygon } from 'viem/chains'
import '@solana/wallet-adapter-react-ui/styles.css'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

const TRACKING_ID = 'G-S7DE4BCME4'
ReactGA.initialize(TRACKING_ID)

// TODO: should be configured by the user
export const eduChain = {
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

export const config = getDefaultConfig({
  appName: 'Kuibu',
  projectId: '05c3ea68819376e65dc4a8802f90f41b',
  chains: [eduChain, polygon],
  ssr: true,
})

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])

  const network = WalletAdapterNetwork.Devnet
  const endpoint = clusterApiUrl(network)
  const wallets = [new PhantomWalletAdapter()]

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <RouterProvider router={createRouter()} />
              <ReactQueryDevtools />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </QueryClientProvider>
    </Provider>
  )
}
