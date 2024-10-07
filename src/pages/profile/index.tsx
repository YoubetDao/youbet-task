import { useState, useEffect } from 'react'
import { SDK } from 'youbet-sdk'
import { SkeletonCard } from '@/components/skeleton-card'
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
import { openCampusTestOptions } from '@/constants/data'

const sdk = new SDK(openCampusTestOptions)

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

export default function ProfilePage() {
  const [linkedAddress, setLinkedAddress] = useState('')
  const [userPoints, setUserPoints] = useState('')
  const [totalRewards, setTotalRewards] = useState(0)
  const [claimedRewards, setClaimedRewards] = useState(0)
  const [loading, setLoading] = useState(true)
  const [username] = useAtom(usernameAtom)
  // use state as empty Profile
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
          let points = 0
          try {
            points = await sdk.client.getUserPoints(linkedAddress)
          } catch (error) {
            console.error('Error fetching user points:', error)
          }
          setUserPoints(points.toString())

          let totalRewards = 0
          try {
            totalRewards = await sdk.client.getTotalRewards(linkedAddress)
          } catch (error) {
            console.error('Error fetching total rewards:', error)
          }
          setTotalRewards(Number(totalRewards) / 10 ** 9)

          let claimedRewards = 0
          try {
            claimedRewards = await sdk.client.getClaimedRewards(linkedAddress)
          } catch (error) {
            console.error('Error fetching claimed rewards:', error)
          }
          setClaimedRewards(Number(claimedRewards) / 10 ** 9)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }

      const myinfo = await getMyInfo()
      setProfile(myinfo)
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
    return <SkeletonTasks />
  }

  return (
    <div className="mx-auto px-4 lg:px-12 py-4 max-w-7xl">
      <div className="flex lg:flex-row flex-col lg:space-x-6 space-y-6 lg:space-y-0 mx-auto max-w-7xl">
        {/* 左侧布局 */}
        <div className="space-y-6 w-full lg:w-1/3">
          {/* 个人信息 Card */}
          <Card className="shadow-lg rounded-lg">
            <div className="flex items-center space-x-6 p-4">
              <div className="flex-shrink-0 rounded-full w-16 h-16 overflow-hidden">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile?.avatarUrl} alt="Avatar" className="object-cover" />
                  <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <h2 className="font-semibold text-2xl text-white leading-relaxed">
                  {profile?.displayName || profile?.username}
                </h2>
                <p className="text-gray-400 leading-relaxed">{profile?.bio || 'No bio...'}</p>
                <div className="flex space-x-4 mt-2">
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
                    href={`https://explorer.solana.com/address/${linkedAddress}?cluster=devnet`}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Wallet size={24} />
                  </a>
                </div>
              </div>
            </div>

            <div className="justify-between items-center grid grid-cols-2 bg-gray-900 p-4 rounded-b-lg">
              <div className="text-center">
                <h3 className="font-bold text-2xl text-white">{profile?.followers}</h3>
                <p className="text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-2xl text-white">{profile?.following}</h3>
                <p className="text-gray-400">Following</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-1 shadow-lg p-4 rounded-lg">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-white">Points</h3>
              <div className="flex justify-between items-center">
                <p className="mb-2 font-bold text-gray-400 text-l">{userPoints}</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-white">Rewards</h3>
              <div className="flex justify-between items-center">
                <p className="mb-2 font-bold text-gray-400 text-l">{totalRewards.toFixed(5)} SOL</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-white">To Claim</h3>
              <div className="flex justify-between items-center">
                <p className="mb-2 font-bold text-gray-400 text-l">{(totalRewards - claimedRewards).toFixed(5)} SOL</p>
                <Button onClick={handleClaim} size="sm" disabled={claiming}>
                  Claim{claiming && <Loader2 className="ml-2 w-4 h-4 animate-spin" />}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-white">Skills</h3>
              <div className="flex flex-wrap">
                <span className="bg-gray-700 m-1 px-3 py-1 rounded-full text-white text-xs">C++</span>
                <span className="bg-gray-700 m-1 px-3 py-1 rounded-full text-white text-xs">Java</span>
                <span className="bg-gray-700 m-1 px-3 py-1 rounded-full text-white text-xs">Python</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 右侧布局 */}
        <div className="space-y-6 w-full lg:w-2/3">
          {/* GitHub 贡献图 Card */}
          <Card className="shadow-lg p-4 rounded-lg">
            <h3 className="mb-2 font-semibold text-lg text-white">Contributions</h3>
            <GitHubCalendar username={profile?.username || ''} />
          </Card>

          {/* 活动流 Card */}
          <Card className="shadow-lg p-4 rounded-lg">
            <h3 className="mb-2 font-semibold text-lg text-white">Recent Activities</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-4">
                <span className="text-gray-400">[PR] Merged PR #42 in youbet-task</span>
                <span className="text-gray-500 text-xs">2 hours ago</span>
              </li>
              <li className="flex items-center space-x-4">
                <span className="text-gray-400">[Issue] Opened Issue #7 in youbet-task</span>
                <span className="text-gray-500 text-xs">4 hours ago</span>
              </li>
              <li className="flex items-center space-x-4">
                <span className="text-gray-400">[Comment] Commented on Issue #7 in youbet-task</span>
                <span className="text-gray-500 text-xs">6 hours ago</span>
              </li>
              {/* 继续添加更多的活动 */}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
