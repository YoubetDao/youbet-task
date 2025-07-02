import { useState, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useUsername, useToken, walletAtom } from '@/store'
import { useAtom } from 'jotai'
import { githubOAuthUri } from '@/lib/auth'
import { Check, Github, Wallet, Loader2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { GDAv1Forwarder } from '@/constants/gdaV1Forwarder'
import { toast } from '@/components/ui/use-toast'

// Base chain ID (主网)
const BASE_CHAIN_ID = 8453

interface BindModalProps {
  open: boolean
  onClose: () => void
  poolAddress?: string
}

enum BindStep {
  GITHUB = 1,
  WALLET = 2,
  CONNECT_POOL = 3,
}

export default function BindModal({
  open,
  onClose,
  poolAddress = import.meta.env.VITE_SUPERFLUID_POOL_ADDRESS,
}: BindModalProps) {
  const [currentStep, setCurrentStep] = useState<BindStep>(BindStep.GITHUB)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const [isConnectingPool, setIsConnectingPool] = useState(false)
  const [isPoolConnected, setIsPoolConnected] = useState(false)
  const [username] = useUsername()
  const [token] = useToken()
  const [walletState] = useAtom(walletAtom)
  const { address, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  // 检查GitHub是否已绑定
  const isGithubBound = !!(username && token)

  // 检查钱包是否已绑定
  const isWalletBound = !!(address && isConnected && walletState.linkedAddress)

  // 检查是否所有步骤都完成
  const isAllBound = isGithubBound && isWalletBound && isPoolConnected

  // 根据绑定状态自动切换步骤
  useEffect(() => {
    if (isGithubBound && !isWalletBound) {
      setCurrentStep(BindStep.WALLET)
    } else if (isGithubBound && isWalletBound && !isPoolConnected) {
      setCurrentStep(BindStep.CONNECT_POOL)
    } else if (!isGithubBound) {
      setCurrentStep(BindStep.GITHUB)
    }

    if (isAllBound) {
      sessionStorage.removeItem('IS_SUPERFLUID')
    }
  }, [isGithubBound, isWalletBound, isPoolConnected])

  // 监听钱包连接状态变化
  useEffect(() => {
    if (isConnected || isWalletBound) {
      setIsWalletModalOpen(false)
    }
  }, [isConnected, isWalletBound])

  // 自动切换到 Base 链
  useEffect(() => {
    if (open && isConnected && address) {
      // 尝试切换到 Base 链
      try {
        switchChain({ chainId: BASE_CHAIN_ID })
      } catch (error) {
        console.error('Failed to switch to Base chain:', error)
        toast({
          variant: 'destructive',
          title: 'Network Switch Failed',
          description: 'Failed to switch to Base network. Please switch manually.',
        })
      }
    }
  }, [open, isConnected, address, switchChain])

  // 添加超时机制，防止钱包弹窗一直隐藏BindModal
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isWalletModalOpen) {
      timer = setTimeout(() => {
        setIsWalletModalOpen(false)
      }, 10000) // 10秒后自动显示BindModal
    }
    return () => clearTimeout(timer)
  }, [isWalletModalOpen])

  const handleGithubBind = () => {
    window.location.href = githubOAuthUri()
  }

  const handleConnectPool = async () => {
    if (!isWalletBound) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet first',
      })
      return
    }

    setIsConnectingPool(true)
    try {
      const gdaForwarder = new GDAv1Forwarder()
      await gdaForwarder.connectPool(poolAddress)

      setIsPoolConnected(true)
      toast({
        title: 'Success',
        description: 'Successfully connected to GDA pool',
      })
    } catch (error) {
      console.error('Error connecting to pool:', error)
      toast({
        variant: 'destructive',
        title: 'Connection failed',
        description: 'Failed to connect to GDA pool. Please try again.',
      })
    } finally {
      setIsConnectingPool(false)
    }
  }

  const renderGithubStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <Github className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <p className="text-sm text-gray-600">
          {isGithubBound ? `Successfully bound to ${username}` : 'Please bind your GitHub account '}
        </p>
      </div>

      {!isGithubBound && (
        <Button onClick={handleGithubBind} className="w-full" size="lg">
          <Github className="mr-2 h-4 w-4" />
          Bind GitHub account
        </Button>
      )}
    </div>
  )

  const renderWalletStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <Wallet className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <p className="text-sm text-gray-600">
          {isWalletBound
            ? `Successfully bound wallet ${address?.slice(0, 6)}...${address?.slice(-4)}`
            : 'Please connect your wallet to receive rewards'}
        </p>
      </div>

      {!isWalletBound && (
        <div>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openConnectModal, authenticationStatus, mounted }) => {
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
                        <Button
                          onClick={() => {
                            setIsWalletModalOpen(true)
                            openConnectModal()
                          }}
                          className="w-full"
                        >
                          Connect Wallet
                        </Button>
                      )
                    }
                    return <div className="flex items-center justify-center gap-2"></div>
                  })()}
                </div>
              )
            }}
          </ConnectButton.Custom>
        </div>
      )}
    </div>
  )

  const renderPoolStep = () => (
    <div className="text-center">
      <div className="mb-6">
        <Zap className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <p className="text-sm text-gray-600">
          {isPoolConnected
            ? `Successfully connected to GDA pool`
            : 'Connect to GDA pool to start earning streaming rewards'}
        </p>
        {poolAddress && (
          <p className="mt-2 text-xs text-gray-500">
            Pool: {poolAddress.slice(0, 6)}...{poolAddress.slice(-4)}
          </p>
        )}
      </div>

      {!isPoolConnected && (
        <Button onClick={handleConnectPool} className="w-full" size="lg" disabled={isConnectingPool || !isWalletBound}>
          {isConnectingPool ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Connect to GDA Pool
            </>
          )}
        </Button>
      )}
    </div>
  )

  return (
    <div className="bind-modal-low-z">
      <style>{`
        .bind-modal-low-z [data-radix-dialog-overlay] {
          z-index: 1 !important;
        }
        .bind-modal-low-z [data-radix-dialog-content] {
          z-index: 1 !important;
        }
        /* 确保钱包连接弹窗显示在最上层 */
        [data-rk] {
          z-index: 9999 !important;
        }
      `}</style>
      <Dialog open={open && !isWalletModalOpen} onOpenChange={onClose}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Account binding</DialogTitle>
            <DialogDescription>
              Bind your Superfluid wallet and GitHub account to start earning $SUP rewards
            </DialogDescription>
          </DialogHeader>

          {/* show bind github */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  isGithubBound ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600',
                )}
              >
                {isGithubBound ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <h3 className="text-md font-semibold">Bind your GitHub</h3>
            </div>

            {renderGithubStep()}
          </div>

          {/* show bind wallet */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  isWalletBound ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600',
                )}
              >
                {isWalletBound ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <h3 className="text-md font-semibold">Bind Your Wallet for Superfluid Rewards</h3>
            </div>

            {renderWalletStep()}
          </div>

          {/* show connect pool */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  isPoolConnected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600',
                )}
              >
                {isPoolConnected ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <h3 className="text-md font-semibold">Connect to GDA Pool</h3>
            </div>

            {renderPoolStep()}
          </div>

          {isAllBound && (
            <div className="flex justify-end gap-3">
              <Button onClick={onClose}>Close</Button>
              <Button className="bg-primary" onClick={() => window.open('https://gohacker.ai/superfluid', '_blank')}>
                Redirect to Gohacker
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
