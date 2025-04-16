import { useState } from 'react'
import { LoadingCards } from '@/components/loading-cards'
import { useUsername, walletAtom } from '@/store'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import GitHubCalendar from 'react-github-calendar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Link, Mail } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { getMyInfo } from '@/service'
import { useAtom } from 'jotai'
import { useAsyncEffect } from 'ahooks'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

// 在组件内添加模拟数据
const languageData = [
  {
    name: 'JavaScript',
    value: 45,
    color: '#f1e05a',
    repos: [
      { name: 'old-hi-Ernest.github.io', percentage: '97%' },
      { name: 'seckill', percentage: '2%' },
      { name: 'vue.js-fight', percentage: '1%' },
    ],
  },
  { name: 'TypeScript', value: 25, color: '#2b7489' },
  { name: 'Python', value: 15, color: '#3572A5' },
  { name: 'Java', value: 10, color: '#b07219' },
  { name: 'Go', value: 5, color: '#00ADD8' },
]

export default function ProfilePageV2() {
  const [loading, setLoading] = useState(true)
  const [username] = useUsername()
  const [profile, setProfile] = useState<Profile>()
  const [showIdentitySettings, setShowIdentitySettings] = useState(false)
  const { toast } = useToast()
  const [walletState] = useAtom(walletAtom)
  const [showOCID, setShowOCID] = useState(true)
  const [showOpenBuildID, setShowOpenBuildID] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'languages', label: 'Languages' },
    { id: 'skillsets', label: 'Skillsets' },
    { id: 'achievements', label: 'Achievements' },
  ]

  useAsyncEffect(async () => {
    if (!username) return
    try {
      const profileData = await getMyInfo()
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [username])

  if (loading) return <LoadingCards />

  const handleOCIDDisplayChange = (checked: boolean) => {
    setShowOCID(checked)
  }

  const handleOpenBuildIDDisplayChange = (checked: boolean) => {
    setShowOpenBuildID(checked)
  }

  const handleDisconnectOCID = () => {
    toast({
      title: 'OCID Disconnected',
      description: 'Your OCID has been disconnected from your profile.',
    })
    setShowOCID(false)
  }

  const handleDisconnectOpenBuildID = () => {
    toast({
      title: 'OpenBuild ID Disconnected',
      description: 'Your OpenBuild ID has been disconnected from your profile.',
    })
    setShowOpenBuildID(false)
  }

  // 自定义工具提示组件
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg bg-gray-800 p-3 shadow-lg">
          <p className="mb-2 font-medium text-white">
            {data.name}: {data.value}%
          </p>
          {data.repos && (
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Repositories:</p>
              {data.repos.map((repo: any) => (
                <div key={repo.name} className="text-xs">
                  <span className="text-gray-400">{repo.name}</span>
                  <span className="ml-2 text-gray-500">{repo.percentage}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 主卡片 - 个人信息 */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 lg:flex-row">
            <Avatar className="h-24 w-24 lg:h-32 lg:w-32">
              <AvatarImage src={profile?.avatarUrl} alt={profile?.displayName} />
              <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{profile?.displayName}</h1>
                <p className="text-gray-400">Remote Developer</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href={`github/${profile?.username}`} className="flex items-center text-gray-400 hover:text-white">
                  <Github className="mr-2 h-4 w-4" />
                  <span>github/{profile?.username}</span>
                </a>
                <a href={`stats/${profile?.username}`} className="flex items-center text-gray-400 hover:text-white">
                  <Link className="mr-2 h-4 w-4" />
                  <span>stats/{profile?.username}</span>
                </a>
                <div className="flex items-center text-gray-400">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>{profile?.email}</span>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{profile?.followers || 14}</p>
                  <p className="text-sm text-gray-400">followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">{profile?.following || 50}</p>
                  <p className="text-sm text-gray-400">following</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-4">
              <span className="text-5xl font-bold text-purple-400">4.8</span>
              <p className="text-sm text-purple-400">Above 4% of people</p>
            </div>
            <Button variant="outline" onClick={() => setShowIdentitySettings(true)}>
              Edit Profile
            </Button>
          </div>
        </div>

        {/* OCID 和 OpenBuild ID */}
        <div className="mt-6 flex flex-wrap gap-4">
          {showOCID && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">OCID:</span>
              <code className="rounded bg-gray-800 px-2 py-1 text-sm text-purple-400">0C1D-2023-78945612</code>
            </div>
          )}
          {showOpenBuildID && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400">OpenBuild ID:</span>
              <code className="rounded bg-gray-800 px-2 py-1 text-sm text-purple-400">0B-2023-98765432</code>
            </div>
          )}
        </div>
      </Card>

      {/* 身份设置对话框 */}
      <Dialog open={showIdentitySettings} onOpenChange={setShowIdentitySettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Identity Settings</DialogTitle>
            <DialogDescription>Manage your connected identities and display preferences.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* OCID 设置 */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">OCID</h4>
              <p className="text-sm text-gray-400">You have a connected OCID 0C1D-2023-78945612 for your account.</p>
              <div className="flex items-center space-x-2">
                <Checkbox id="show-ocid" checked={showOCID} onCheckedChange={handleOCIDDisplayChange} />
                <label htmlFor="show-ocid" className="text-sm text-gray-400">
                  Display your OCID on your profile
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Disconnecting your OCID may affect areas of your profile where your OCID is displayed.
              </p>
              <Button variant="outline" className="w-full" onClick={handleDisconnectOCID}>
                Disconnect your OCID
              </Button>
            </div>

            {/* OpenBuild ID 设置 */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">OpenBuild ID</h4>
              <p className="text-sm text-gray-400">
                You have a connected OpenBuild ID 0B-2023-98765432 for your account.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-openbuild"
                  checked={showOpenBuildID}
                  onCheckedChange={handleOpenBuildIDDisplayChange}
                />
                <label htmlFor="show-openbuild" className="text-sm text-gray-400">
                  Display your OpenBuild ID on your profile
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Disconnecting your OpenBuild ID may affect areas of your profile where your OpenBuild ID is displayed.
              </p>
              <Button variant="outline" className="w-full" onClick={handleDisconnectOpenBuildID}>
                Disconnect OpenBuild ID
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导航标签 */}
      <div className="flex overflow-x-auto border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-2 transition-colors hover:text-white
              ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-300" />
            )}
            {/* 添加悬停效果 */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 bg-purple-500/50 transition-transform duration-200
                ${activeTab === tab.id ? 'scale-x-0' : 'hover:scale-x-100'}
              `}
            />
          </button>
        ))}
      </div>

      {/* 根据激活的标签显示不同内容 */}
      {activeTab === 'overview' && (
        <>
          {/* 贡献图表 */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Contributions</h2>
            <div className="w-full overflow-x-auto">
              {profile?.username && <GitHubCalendar username={profile.username} colorScheme="dark" fontSize={12} />}
            </div>
            <p className="mt-4 text-gray-400">40 contributions in the last year</p>
          </Card>

          {/* 最近活动 */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-bold text-white">Recent Activities</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">[PR] Merged PR #42 in youbet-task</span>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">[Issue] Opened Issue #7 in youbet-task</span>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">[Comment] Commented on Issue #7 in youbet-task</span>
                <span className="text-sm text-gray-500">6 hours ago</span>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'languages' && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Programming Languages</h2>
            <p className="text-sm text-gray-400">Last updated: April 15, 2024</p>
          </div>
          <p className="mt-2 text-sm text-gray-400">
            This chart shows the distribution of programming languages used across your repositories.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              {languageData.map((lang) => (
                <div key={lang.name} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-white">{lang.name}</span>
                  <span className="text-gray-400">{lang.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'skillsets' && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Technical Skills</h2>
          {/* 这里添加技能分布图表 */}
        </Card>
      )}

      {activeTab === 'achievements' && (
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Achievements</h2>
          {/* 这里添加成就展示 */}
        </Card>
      )}
    </div>
  )
}
