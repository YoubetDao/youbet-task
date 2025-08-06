import { useCallback, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useDistributorToken } from './useDistributorToken'
import { useToast } from '@/components/ui/use-toast'
import { getDistributor } from '@/constants/distributor'

const APPROVE_MULTIPLIER = 10

interface UseAllowanceCheckOptions {
  minAllowanceMultiplier?: number // default 50
}

export function useAllowanceCheck(options: UseAllowanceCheckOptions = {}) {
  const { minAllowanceMultiplier = 50 } = options
  const { toast } = useToast()
  const { address } = useAccount()
  const { decimals, error: tokenError, loading: tokenLoading } = useDistributorToken()
  const [hasAllowance, setHasAllowance] = useState<boolean | null>(null)

  const tokenDecimals = BigInt(decimals)
  const MIN_ALLOWANCE = BigInt(minAllowanceMultiplier) * BigInt(APPROVE_MULTIPLIER) ** tokenDecimals

  const checkAllowance = useCallback(async () => {
    if (address && !tokenError && !tokenLoading) {
      try {
        const distributor = await getDistributor()
        const allowance = await distributor.getAllowance(address)
        setHasAllowance(allowance >= MIN_ALLOWANCE)
      } catch (error) {
        if (error instanceof Error && error.message.includes('JsonRpcProvider failed to detect network')) {
          toast({
            variant: 'destructive',
            title: 'Network Error',
            description: 'Failed to connect to the network. Please check your connection and try again.',
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to check allowance',
          })
        }
        console.error('Error checking allowance:', error)
        setHasAllowance(false)
      }
    }
  }, [address, MIN_ALLOWANCE, tokenError, tokenLoading, toast])

  const approveAllowance = useCallback(async () => {
    try {
      const distributor = await getDistributor()
      await distributor.approveAllowance(MIN_ALLOWANCE * BigInt(APPROVE_MULTIPLIER))
      await checkAllowance()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve allowance',
      })
      console.error('Error approving allowance:', error)
    }
  }, [MIN_ALLOWANCE, checkAllowance, toast])

  useEffect(() => {
    if (address && !tokenError && !tokenLoading) {
      checkAllowance()
    }
  }, [address, checkAllowance, tokenError, tokenLoading])

  useEffect(() => {
    if (tokenError) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load token information',
      })
    }
  }, [tokenError, toast])

  return {
    hasAllowance,
    checkAllowance,
    approveAllowance,
    MIN_ALLOWANCE,
    tokenError,
    tokenLoading,
  }
}
