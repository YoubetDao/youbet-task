import { useState, useRef } from 'react'
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
import { ScanButton } from './components/ScanButton'
import { OnboardingGuide } from './components/OnboardingGuide'

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
  const [isNewUser, setIsNewUser] = useState(true)
  const [showGuide, setShowGuide] = useState(() => {
    // 检查用户是否已经看过引导
    const hasSeenGuide = localStorage.getItem('hasSeenGuide')
    return !hasSeenGuide // 如果没有看过，则显示引导
  })
  const scanButtonRef = useRef<HTMLButtonElement>(null)

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
      // 获取用户配置信息
      // const { data: userConfig } = await userApi.userControllerGetUserConfig(currentUser)
      const userConfig = {
        data: {
          hasScannedRepos: false,
        },
      }
      const isFirstVisit = !userConfig.data.hasScannedRepos
      setIsNewUser(isFirstVisit)

      // 只有在用户没有看过引导的情况下才显示
      const hasSeenGuide = localStorage.getItem('hasSeenGuide')
      if (isFirstVisit && !hasSeenGuide) {
        setShowGuide(true)
      }
      // 暂时先显示引导
      setShowGuide(true)

      // 获取用户概览信息
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

  // 处理引导关闭
  const handleGuideClose = () => {
    setShowGuide(false)
    // 记录用户已查看引导
    localStorage.setItem('hasSeenGuide', 'true')
  }

  console.log('profile', profile)

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* 主卡片 - 个人信息 */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* 左侧：个人信息 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Avatar className="h-20 w-20 shrink-0 bg-orange-500 sm:h-24 sm:w-24 lg:h-28 lg:w-28">
              <AvatarImage src={profile?.avatarUrl} alt={currentUser || profile?.displayName} />
              <AvatarFallback>{currentUser || profile?.displayName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">{currentUser || profile?.displayName}</h1>
                <p className="text-sm text-gray-400 sm:text-base">Remote Developer</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm sm:gap-4">
                <a href={`github/${currentUser}`} className="flex items-center text-gray-400 hover:text-white">
                  <Github className="mr-1.5 h-4 w-4" />
                  <span>github/{currentUser}</span>
                </a>
                <a href={`stats/${currentUser}`} className="flex items-center text-gray-400 hover:text-white">
                  <Link className="mr-1.5 h-4 w-4" />
                  <span>stats/{currentUser}</span>
                </a>
                {profile?.email && (
                  <div className="flex items-center text-gray-400">
                    <Mail className="mr-1.5 h-4 w-4" />
                    <span className="break-all">{profile?.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-white sm:text-xl">{profile?.followers || 14}</p>
                  <p className="text-xs text-gray-400 sm:text-sm">followers</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white sm:text-xl">{profile?.following || 50}</p>
                  <p className="text-xs text-gray-400 sm:text-sm">following</p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：评分和操作 */}
          <div className="flex flex-col items-end justify-start gap-3 sm:gap-4">
            {currentUser && (
              <div className="w-full sm:w-auto">
                <ScanButton
                  ref={scanButtonRef}
                  userName={currentUser}
                  onScanComplete={() => {
                    window.location.reload()
                  }}
                />
              </div>
            )}
            <div className="flex w-full flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
              <span className="text-4xl font-bold text-purple-400 sm:text-5xl lg:text-6xl">5.5</span>
              <div className="flex flex-col items-end">
                <p className="text-sm text-purple-400">Above 96% of developers</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full bg-gray-800 sm:w-32 lg:w-40">
                    <div className="h-full w-[96%] rounded-full bg-purple-400" />
                  </div>
                  <span className="text-xs text-gray-400">96%</span>
                </div>
              </div>
            </div>
          </div>
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

      {/* 引导组件 */}
      <OnboardingGuide isVisible={showGuide} onClose={handleGuideClose} targetButtonRef={scanButtonRef} />

      {/* 导航标签 */}
      <div className="no-scrollbar flex overflow-x-auto border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative whitespace-nowrap px-3 py-2 text-sm transition-colors hover:text-white sm:px-4
              ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-300" />
            )}
            <div
              className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 bg-purple-500/50 transition-transform duration-200
                ${activeTab === tab.id ? 'scale-x-0' : 'hover:scale-x-100'}
              `}
            />
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <>
            {/* 贡献图表 */}
            <Card className="overflow-hidden p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white sm:text-xl">Contributions</h2>
                <p className="text-sm text-gray-400">
                  {profile?.totalContributions || 48} contributions in the last year
                </p>
              </div>
              <div className="mt-6 flex min-h-[140px] w-full items-center justify-center">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-full">
                    {profile?.login && (
                      <GitHubCalendar
                        username={profile.login}
                        colorScheme="dark"
                        fontSize={10}
                        blockSize={12}
                        blockMargin={4}
                        blockRadius={2}
                        showWeekdayLabels={true}
                        hideColorLegend={false}
                        style={{
                          minWidth: '100%',
                          width: '100%',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <span className="text-sm text-gray-400">Less</span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-4 w-4 rounded-sm ${
                        level === 0
                          ? 'bg-gray-800'
                          : level === 1
                          ? 'bg-green-900'
                          : level === 2
                          ? 'bg-green-700'
                          : level === 3
                          ? 'bg-green-500'
                          : 'bg-green-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">More</span>
              </div>
            </Card>
            {/* Contributed To */}
            <div className="mt-6">
              <ContributedTo userName={currentUser || ''} />
            </div>
          </>
        )}

        {activeTab === 'languages' && <LanguageTab userName={currentUser || ''} />}
        {activeTab === 'skillsets' && <Skillsets userName={currentUser || ''} />}
        {activeTab === 'achievements' && <Achievements userName={currentUser || ''} />}
      </div>
    </div>
  )
}
