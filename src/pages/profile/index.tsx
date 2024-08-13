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
  const [loading, setLoading] = useState(true)
  const [username] = useAtom(usernameAtom)
  // use state as empty Profile
  const [profile, setProfile] = useState<Profile>()

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
    <div className="flex max-w-7xl mx-auto p-6 space-x-6">
      {/* 左侧布局 */}
      <div className="w-1/3 space-y-6">
        {/* 个人信息 Card */}
        <Card className="rounded-lg shadow-lg">
          <div className="flex items-center p-4 space-x-6">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Avatar className="h-full w-full">
                <AvatarImage src={profile?.avatarUrl} alt="Avatar" className="object-cover" />
                <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold text-white leading-relaxed">
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
                  href={`https://sepolia.scrollscan.dev/address/${linkedAddress}`}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Wallet size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-32 p-4 bg-gray-900 rounded-b-lg ">
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

        <Card className="rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-white">Points</h3>
          <p className="text-l font-bold text-gray-400 mb-2">{userPoints}</p>
          <h3 className="text-lg font-semibold text-white">Skills</h3>
          <div className="flex flex-wrap">
            <span className="text-xs bg-gray-700 text-white rounded-full px-3 py-1 m-1">C++</span>
            <span className="text-xs bg-gray-700 text-white rounded-full px-3 py-1 m-1">Java</span>
            <span className="text-xs bg-gray-700 text-white rounded-full px-3 py-1 m-1">Python</span>
          </div>
        </Card>
      </div>

      {/* 右侧布局 */}
      <div className="w-2/3 space-y-6">
        {/* GitHub 贡献图 Card */}
        <Card className="rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Contributions</h3>
          <GitHubCalendar username="wfnuser" />
        </Card>

        {/* 活动流 Card */}
        <Card className="rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">Recent Activities</h3>
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
  )
}
