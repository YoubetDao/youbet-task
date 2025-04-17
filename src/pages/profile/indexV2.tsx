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
import { useAtom } from 'jotai'
import { useAsyncEffect } from 'ahooks'
import { useSearchParams } from 'react-router-dom'
import { LanguageTab } from './components/LanguageTab'
import { ContributedTo } from './components/ContributedTo'
import { Skillsets } from './components/Skillsets'
import { Achievements } from './components/Achievements'
import { userApi } from '@/service/openApi'

// 添加类型定义
interface MainSkill {
  name: string
  value: number
  color: string
  description: string
}

interface SubSkill {
  name: string
  parent: string
  value: number
  description?: string
}

// 更新语言数据结构
const languageData = [
  { name: 'Python', value: 45, color: '#3572A5' },
  { name: 'C++', value: 20, color: '#f34b7d' },
  { name: 'Verilog', value: 15, color: '#b2b7f8' },
  { name: 'Jupyter Notebook', value: 8, color: '#DA5B0B' },
  { name: 'Tcl', value: 4, color: '#1e5cb3' },
  { name: 'Vue', value: 3, color: '#41b883' },
  { name: 'C', value: 2, color: '#555555' },
  { name: 'MATLAB', value: 2, color: '#e16737' },
  { name: 'CSS', value: 1, color: '#563d7c' },
]

// 为 SkillTooltip 添加类型定义
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: MainSkill | SubSkill
  }>
}

const isSubSkill = (data: MainSkill | SubSkill): data is SubSkill => {
  return 'parent' in data
}

export const SkillTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg bg-gray-800/90 p-4 shadow-lg backdrop-blur">
        <div className="mb-2">
          <span className="text-lg font-medium text-white">{data.name}</span>
          <span className="ml-2 text-sm text-gray-400">{data.value}%</span>
        </div>
        {data.description && <p className="text-sm text-gray-300">{data.description}</p>}
        {isSubSkill(data) && <p className="mt-1 text-xs text-gray-400">Part of {data.parent}</p>}{' '}
      </div>
    )
  }
  return null
}

// 修改成就数据
const achievementsData = [
  {
    id: 'quick-starter',
    name: 'Quick Starter',
    description: 'Completed first contribution within 24 hours of joining',
    icon: '🚀',
    date: '2024-01-15',
    rarity: 'Common',
    progress: 100,
    stats: 'First contribution: 6 hours after joining',
  },
  {
    id: 'popular-repo-guardian',
    name: 'Popular Repository Guardian',
    description: 'Maintain a repository with over 1,000 stars',
    icon: '⭐',
    date: '2024-03-15',
    rarity: 'Epic',
    progress: 100,
    stats: 'Current highest stars: 1.2k',
  },
  {
    id: 'consistent-contributor',
    name: 'Consistent Contributor',
    description: 'Contributed code for 7 consecutive days',
    icon: '🏃',
    date: '2024-04-01',
    rarity: 'Rare',
    progress: 100,
    stats: 'Current streak: 12 days',
  },
  {
    id: 'popular-pr-contributor',
    name: 'Popular Project Contributor',
    description: 'Successfully merged PRs into popular open source projects',
    icon: '🔥',
    date: '2024-03-20',
    rarity: 'Epic',
    progress: 100,
    stats: 'Merged PRs: 5',
  },
  {
    id: 'comment-champion',
    name: 'Comment Champion',
    description: 'Made over 50 comments in 3 days',
    icon: '💬',
    date: '2024-03-25',
    rarity: 'Uncommon',
    progress: 100,
    stats: 'Highest comments: 65',
  },
  {
    id: 'issue-expert',
    name: 'Issue Expert',
    description: 'Created over 20 issues in 7 days',
    icon: '❓',
    date: '2024-03-10',
    rarity: 'Rare',
    progress: 100,
    stats: 'Highest issues: 25',
  },
  {
    id: 'code-reviewer',
    name: 'Code Review Expert',
    description: 'Reviewed over 100 pull requests',
    icon: '👀',
    date: '2024-04-05',
    rarity: 'Epic',
    progress: 85,
    stats: 'Reviewed PRs: 85',
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter',
    description: 'Found and fixed 10 critical bugs',
    icon: '🐛',
    date: '2024-03-28',
    rarity: 'Rare',
    progress: 90,
    stats: 'Fixed bugs: 9/10',
  },
  {
    id: 'night-coder',
    name: 'Night Owl Coder',
    description: 'Made code commits at midnight for 5 consecutive days',
    icon: '🌙',
    date: '2024-04-02',
    rarity: 'Uncommon',
    progress: 60,
    stats: 'Night commits: 3/5',
  },
  {
    id: 'polyglot',
    name: 'Polyglot Developer',
    description: 'Mastered more than 5 programming languages',
    icon: '🌐',
    date: '2024-03-30',
    rarity: 'Legendary',
    progress: 80,
    stats: 'Languages mastered: 4/5',
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'First to report 5 critical issues that were later confirmed',
    icon: '🌅',
    date: '2024-04-10',
    rarity: 'Epic',
    progress: 70,
    stats: 'Confirmed issues: 7/10',
  },
  {
    id: 'documentation-hero',
    name: 'Documentation Hero',
    description: 'Made significant improvements to project documentation',
    icon: '📚',
    date: '2024-04-12',
    rarity: 'Rare',
    progress: 95,
    stats: 'Doc improvements: 19/20',
  },
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
  const [searchParams] = useSearchParams()
  const searchUser = searchParams.get('searchUser')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 8
  const totalPages = Math.ceil(languageData.length / itemsPerPage)
  const [achievementPage, setAchievementPage] = useState(0)
  const achievementsPerPage = 6
  const totalAchievementPages = Math.ceil(achievementsData.length / achievementsPerPage)

  const currentUser = searchUser || username

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'languages', label: 'Languages' },
    { id: 'skillsets', label: 'Skillsets' },
    { id: 'achievements', label: 'Achievements' },
  ]

  useAsyncEffect(async () => {
    if (!currentUser) return
    try {
      const { data } = (await userApi.userControllerGetProfileOverview(currentUser)) as any
      setProfile(data.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }, [currentUser])

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

  console.log('profile', profile)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* 主卡片 - 个人信息 */}
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 lg:flex-row">
            <Avatar className="h-24 w-24 lg:h-32 lg:w-32">
              <AvatarImage src={profile?.avatarUrl} alt={currentUser || profile?.displayName} />
              <AvatarFallback>{currentUser || profile?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{currentUser || profile?.displayName}</h1>{' '}
                <p className="text-gray-400">Remote Developer</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href={`github/${currentUser}`} className="flex items-center text-gray-400 hover:text-white">
                  <Github className="mr-2 h-4 w-4" />
                  <span>github/{currentUser}</span>
                </a>
                <a href={`stats/${currentUser}`} className="flex items-center text-gray-400 hover:text-white">
                  <Link className="mr-2 h-4 w-4" />
                  <span>stats/{currentUser}</span>
                </a>
                {profile?.email && (
                  <div className="flex items-center text-gray-400">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{profile?.email}</span>
                  </div>
                )}
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
              <span className="text-5xl font-bold text-purple-400"> {profile?.score || 0}</span>
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
              {profile?.login && <GitHubCalendar username={profile.login || ''} colorScheme="dark" fontSize={12} />}
            </div>
            <p className="mt-4 text-gray-400">40 contributions in the last year</p>
          </Card>
          {/* Contributed To */}
          <ContributedTo userName={currentUser || ''} />
        </>
      )}

      {activeTab === 'languages' && <LanguageTab userName={currentUser || ''} />}

      {activeTab === 'skillsets' && <Skillsets userName={currentUser || ''} />}

      {activeTab === 'achievements' && <Achievements userName={currentUser || ''} />}
    </div>
  )
}
