import { distributor } from '@/constants/distributor'

import { useEffect, useState } from 'react'

interface TokenInfo {
  symbol: string
  decimals: number
  loading: boolean
  error: Error | null
}

export function useDistributorToken() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    symbol: 'USDT',
    decimals: 6,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const getTokenInfo = async () => {
      try {
        const [symbol, decimals] = await distributor.getTokenSymbolAndDecimals()
        setTokenInfo({
          symbol,
          decimals,
          loading: false,
          error: null,
        })
      } catch (error) {
        console.log(error)
        setTokenInfo((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        }))
      }
    }

    getTokenInfo()
  }, [])

  return tokenInfo
}
