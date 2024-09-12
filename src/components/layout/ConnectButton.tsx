import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { getLinkedWallet, linkWallet } from '@/service'

export const CustomConnectButton = () => {
  const [github] = useAtom(usernameAtom)

  const { address } = useAccount()

  useEffect(() => {
    const checkAndLinkWallet = async () => {
      if (!github) return
      console.log('call link')
      // 获取当前github用户绑定的钱包地址
      const linkedAddress = await getLinkedWallet(github)
      console.log(linkedAddress)
      // 如果没有绑定过钱包
      if (linkedAddress == '0x0000000000000000000000000000000000000000') {
        if (!address) return
        const res = await linkWallet({
          github,
          address,
        })
        console.log(res)
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
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={openChainModal} style={{ display: 'flex', alignItems: 'center' }} type="button">
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} style={{ width: 12, height: 12 }} />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
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
