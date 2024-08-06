import { useState, useEffect } from 'react'
import { NetworkType, SDK } from 'youbet-sdk'
import { SkeletonCard } from '@/components/skeleton-card'
import http from '@/service/instance'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'

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
  // const [username, setUsername] = useState('')
  const [linkedAddress, setLinkedAddress] = useState('')
  const [userPoints, setUserPoints] = useState('')
  const [loading, setLoading] = useState(true)
  const [username] = useAtom(usernameAtom)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!username) return

        const response = await http.get<string>(`/get-linked-wallet?github=${username}`)
        const linkedAddress = response.data
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
  }, [username])

  if (loading) {
    return <SkeletonTasks />
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">User Profile</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Username</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{username}</dd>
          </div>
          {/* github link */}
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Github</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <a href={`https://github.com/${username}`}>https://github.com/{username}</a>
            </dd>
          </div>

          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Linked Address</dt>

            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <a href={`https://sepolia.scrollscan.dev/address/${linkedAddress}`}>{linkedAddress}</a>
            </dd>
          </div>
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">User Points</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{userPoints}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
