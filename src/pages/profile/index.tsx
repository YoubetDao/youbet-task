import { useState, useEffect } from 'react'
import { LoadingCards } from '@/components/loading-cards'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { Card } from '@/components/ui/card'
import GitHubCalendar from 'react-github-calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Loader2, Twitter, Wallet } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { getLinkedWallet, getMyInfo } from '@/service'
import { currentChain, sdk } from '@/constants/data'

export default function ProfilePage() {
  const [linkedAddress, setLinkedAddress] = useState('')
  const [userPoints, setUserPoints] = useState('')
  const [totalRewards, setTotalRewards] = useState(0)
  const [claimedRewards, setClaimedRewards] = useState(0)
  const [loading, setLoading] = useState(true)
  const [username] = useAtom(usernameAtom)
  const [profile, setProfile] = useState<Profile>()
  const [claiming, setClaiming] = useState(false)
  const { toast } = useToast()

  const fetchRewards = async () => {
    const totalRewards = await sdk.client.getTotalRewards(linkedAddress)
    setTotalRewards(Number(totalRewards) / 10 ** 18)

    const claimedRewards = await sdk.client.getClaimedRewards(linkedAddress)
    setClaimedRewards(Number(claimedRewards) / 10 ** 18)
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!username) return

        const linkedAddress = await getLinkedWallet(username)
        setLinkedAddress(linkedAddress)

        if (linkedAddress !== '0x0000000000000000000000000000000000000000') {
          const points = await sdk.client.getUserPoints(linkedAddress)
          const totalRewards = await sdk.client.getTotalRewards(linkedAddress)
          const claimedRewards = await sdk.client.getClaimedRewards(linkedAddress)

          setTotalRewards(Number(totalRewards) / 10 ** 18)
          setUserPoints(points.toString())
          setClaimedRewards(Number(claimedRewards) / 10 ** 18)
        }

        const myinfo = await getMyInfo()
        setProfile(myinfo)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [username])

  const handleClaim = async () => {
    setClaiming(true)
    try {
      await sdk.contract.claimReward()
      fetchRewards()
    } catch (error) {
      console.error('Error claiming rewards:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error claiming rewards',
      })
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return <LoadingCards />
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
      <div className="w-full space-y-6 lg:w-1/3">
        <Card className="rounded-lg shadow-lg">
          <div className="flex items-center space-x-6 p-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
              <Avatar className="h-full w-full">
                <AvatarImage src={profile?.avatarUrl} alt="Avatar" className="object-cover" />
                <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold leading-relaxed text-white">
                {profile?.displayName || profile?.username}
              </h2>
              <p className="leading-relaxed text-gray-400">{profile?.bio || 'No bio...'}</p>
              <div className="mt-2 flex space-x-4">
                <a
                  href={`https://github.com/${profile?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Github size={24} />
                </a>
                {profile?.twitterUsername && (
                  <a
                    href={`https://twitter.com/${profile?.twitterUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Twitter size={24} />
                  </a>
                )}

                <a
                  href={`https://opencampus-codex.blockscout.com/address/${linkedAddress}`}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Wallet size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 items-center justify-between rounded-b-lg bg-gray-900 p-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{profile?.followers}</h3>
              <p className="text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">{profile?.following}</h3>
              <p className="text-gray-400">Following</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-1 rounded-lg p-4 shadow-lg">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Points</h3>
            <div className="flex items-center justify-between">
              <p className="text-l mb-2 font-bold text-gray-400">{userPoints}</p>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Rewards</h3>
            <div className="flex items-center justify-between">
              <p className="text-l mb-2 font-bold text-gray-400">
                {totalRewards.toFixed(5)} {currentChain.nativeCurrency.symbol}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">To Claim</h3>
            <div className="flex items-center justify-between">
              <p className="text-l mb-2 font-bold text-gray-400">
                {(totalRewards - claimedRewards).toFixed(5)} {currentChain.nativeCurrency.symbol}
              </p>
              <Button onClick={handleClaim} size="sm" disabled={claiming}>
                Claim{claiming && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <div className="flex flex-wrap">
              <span className="m-1 rounded-full bg-gray-700 px-3 py-1 text-xs text-white">C++</span>
              <span className="m-1 rounded-full bg-gray-700 px-3 py-1 text-xs text-white">Java</span>
              <span className="m-1 rounded-full bg-gray-700 px-3 py-1 text-xs text-white">Python</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full space-y-6 lg:w-2/3">
        <Card className="rounded-lg p-4 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-white">Contributions</h3>
          <GitHubCalendar username={profile?.username || ''} />
        </Card>

        <Card className="rounded-lg p-4 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold text-white">Recent Activities</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-4">
              <span className="text-gray-400">[PR] Merged PR #42 in youbet-task</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-gray-400">[Issue] Opened Issue #7 in youbet-task</span>
              <span className="text-xs text-gray-500">4 hours ago</span>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-gray-400">[Comment] Commented on Issue #7 in youbet-task</span>
              <span className="text-xs text-gray-500">6 hours ago</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
