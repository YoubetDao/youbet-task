import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { useAccount, useSwitchChain } from 'wagmi'
import { useEffect, useState } from 'react'
import { getLinkedWallet, linkWallet } from '@/service'
import { eduChain } from '@/app'
import { useWallet } from '@solana/wallet-adapter-react'
import { polygon } from 'viem/chains'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export const SolanaConnectButton = () => {
  const { publicKey, connected } = useWallet()
  const [github] = useAtom(usernameAtom)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const checkAndLinkWallet = async () => {
      if (connected && publicKey && github) {
        setIsChecking(true)
        try {
          const linkedAddress = await getLinkedWallet(github)
          if (linkedAddress === '0x0000000000000000000000000000000000000000') {
            // 如果没有链接的钱包，则进行链接
            await linkWallet({
              github,
              address: publicKey.toString(),
            })
            console.log('Wallet linked successfully')
          } else {
            console.log(linkedAddress)
            console.log('Wallet already linked')
          }
        } catch (error) {
          console.error('Failed to check or link wallet:', error)
        } finally {
          setIsChecking(false)
        }
      }
    }

    checkAndLinkWallet()
  }, [connected, publicKey, github])

  return <WalletMultiButton />
}

export const CustomConnectButton = () => {
  const [github] = useAtom(usernameAtom)
  const { address } = useAccount()
  const { switchChain } = useSwitchChain()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const currentPath = window.location.pathname

    if (currentPath.includes('admin')) {
      setIsAdmin(true)
      switchChain({ chainId: polygon.id })
    } else {
      switchChain({ chainId: eduChain.id })
      setIsAdmin(false)
    }
  }, [switchChain])

  useEffect(() => {
    const checkAndLinkWallet = async () => {
      if (!github) return
      const linkedAddress = await getLinkedWallet(github)
      if (linkedAddress == '0x0000000000000000000000000000000000000000') {
        if (!address) return
        await linkWallet({
          github,
          address,
        })
      }
    }
    checkAndLinkWallet()
  }, [address, github])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                )
              }
              if (chain.id !== eduChain.id && !isAdmin) {
                return (
                  <button type="button" onClick={() => switchChain({ chainId: eduChain.id })}>
                    Wrong network
                  </button>
                )
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>{chain.name}</div>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
