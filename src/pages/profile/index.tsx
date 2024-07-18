import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { NetworkType, SDK } from 'youbet-sdk'
import { SkeletonCard } from '@/components/skeleton-card'

const sdk = new SDK({
  networkType: NetworkType.Testnet, // or NetworkType.Mainnet
})

function SkeletonTasks() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

export default function Profile() {
  const [username, setUsername] = useState('')
  const [linkedAddress, setLinkedAddress] = useState('')
  const [userPoints, setUserPoints] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const github = Cookies.get('username')
        setUsername(github || '')

        const linkedAddressResponse = await fetch(`/api/get-linked-wallet?github=${github}`)
        const linkedAddress = await linkedAddressResponse.text()
        setLinkedAddress(linkedAddress)

        if (linkedAddress !== '0x0000000000000000000000000000000000000000') {
          const points = await sdk.client.getUserPoints(linkedAddress)
          setUserPoints(points.toString())
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (loading) {
    return <SkeletonTasks />
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {username}</p>
      <p>Linked Address: {linkedAddress}</p>
      <p>User Points: {userPoints}</p>
      {/* 添加更多的用户信息显示 */}
    </div>
  )
}
