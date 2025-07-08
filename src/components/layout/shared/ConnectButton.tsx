import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useSwitchChain } from 'wagmi'
import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { currentChain, paymentChain } from '@/constants/data'
import { useLinkWallet } from '@/hooks/useLinkWallet'

interface Props {
  className?: string
}

export const CustomConnectButton = ({ className }: Props) => {
  const { switchChain } = useSwitchChain()
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const isSuperfluidContext = () => {
    // 检查URL参数或sessionStorage中的superfluid标记
    const hasUrlParam = location.pathname.includes('/dashboard') && searchParams.get('superfluid') === 'true'
    const hasSessionStorage = !!sessionStorage.getItem('IS_SUPERFLUID')
    return hasUrlParam || (location.pathname.includes('/dashboard') && hasSessionStorage)
  }

  useLinkWallet({
    enabled: !isAdmin && !isSuperfluidContext(),
    additionalConditions: true,
  })

  useEffect(() => {
    const currentPath = location.pathname

    if (currentPath.includes('admin')) {
      setIsAdmin(true)
      switchChain({ chainId: paymentChain.id })
    } else if (currentPath.includes('myrewards')) {
      switchChain({ chainId: paymentChain.id })
      setIsAdmin(false)
    } else {
      switchChain({ chainId: currentChain.id })
      setIsAdmin(false)
    }
  }, [switchChain, location.pathname])

  // linkWallet 逻辑已由 useLinkWallet hook 处理

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, authenticationStatus, mounted }) => {
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
            // className={className}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
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
