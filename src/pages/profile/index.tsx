import { useState, useEffect } from 'react'
import { NetworkType, SDK } from 'youbet-sdk'
import { SkeletonCard } from '@/components/skeleton-card'
import http from '@/service/instance'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { Card } from '@/components/ui/card'
import GitHubCalendar from 'react-github-calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Twitter, Wallet } from 'lucide-react'

import { Profile } from '@/types'
import { Button } from '@/components/ui/button'

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

export default function ProfilePage() {
  const [linkedAddress, setLinkedAddress] = useState('')
  const [userPoints, setUserPoints] = useState('')
  const [totalRewards, setTotalRewards] = useState(0)
  const [claimedRewards, setClaimedRewards] = useState(0)
  const [loading, setLoading] = useState(true)
  const [username] = useAtom(usernameAtom)
  // use state as empty Profile
  const [profile, setProfile] = useState<Profile>()

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

        const response = await http.get<string>(`/get-linked-wallet?github=${username}`)
        const linkedAddress = response.data
        setLinkedAddress(linkedAddress)

        if (linkedAddress !== '0x0000000000000000000000000000000000000000') {
          const points = await sdk.client.getUserPoints(linkedAddress)
          setUserPoints(points.toString())

          const totalRewards = await sdk.client.getTotalRewards(linkedAddress)
          setTotalRewards(Number(totalRewards) / 10 ** 18)

          const claimedRewards = await sdk.client.getClaimedRewards(linkedAddress)
          setClaimedRewards(Number(claimedRewards) / 10 ** 18)
        }

        const myinfo = (await http.get<Profile>(`/my-info`)).data
        setProfile(myinfo)
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
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-col mx-auto space-y-6 lg:space-y-0 lg:space-x-6 lg:flex-row max-w-7xl">
        {/* 左侧布局 */}
        <div className="w-full space-y-6 lg:w-1/3">
          {/* 个人信息 Card */}
          <Card className="rounded-lg shadow-lg">
            <div className="flex items-center p-4 space-x-6">
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full">
                <Avatar className="w-full h-full">
                  <AvatarImage src={profile?.avatarUrl} alt="Avatar" className="object-cover" />
                  <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl font-semibold leading-relaxed text-white">
                  {profile?.displayName || profile?.username}
                </h2>
                <p className="leading-relaxed text-gray-400">{profile?.bio || 'No bio...'}</p>
                <div className="flex mt-2 space-x-4">
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

            <div className="flex justify-center p-4 space-x-32 bg-gray-900 rounded-b-lg ">
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

          <Card className="p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white">Points</h3>
            <p className="mb-2 font-bold text-gray-400 text-l">{userPoints}</p>
            <h3 className="text-lg font-semibold text-white">Rewards</h3>
            <p className="mb-2 font-bold text-gray-400 text-l">{totalRewards.toFixed(5)} EDU</p>
            <Button
              asChild
              variant="link"
              className="text-gray-50 !p-0 overflow-hidden text-lg font-bold whitespace-nowrap text-ellipsis"
            >
              <span
                className="z-10"
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  await sdk.contract.claimReward()
                  fetchRewards()
                }}
              >
                To Claim
              </span>
            </Button>
            <p className="mb-2 font-bold text-gray-400 text-l">{(totalRewards - claimedRewards).toFixed(5)} EDU</p>
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <div className="flex flex-wrap">
              <span className="px-3 py-1 m-1 text-xs text-white bg-gray-700 rounded-full">C++</span>
              <span className="px-3 py-1 m-1 text-xs text-white bg-gray-700 rounded-full">Java</span>
              <span className="px-3 py-1 m-1 text-xs text-white bg-gray-700 rounded-full">Python</span>
            </div>
          </Card>
        </div>

        {/* 右侧布局 */}
        <div className="w-full space-y-6 lg:w-2/3">
          {/* GitHub 贡献图 Card */}
          <Card className="p-4 rounded-lg shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-white">Contributions</h3>
            <GitHubCalendar username={profile?.username || ''} />
          </Card>

          {/* 活动流 Card */}
          <Card className="p-4 rounded-lg shadow-lg">
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
              {/* 继续添加更多的活动 */}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
