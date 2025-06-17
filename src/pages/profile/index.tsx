import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Github, Star, Code, Bug, Users, Trophy, TerminalSquare, Lock, TrendingUp, Wallet } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts'
import { cn } from '@/lib/utils'
import { useUsername, walletAtom, useToken } from '@/store'
import { useToast } from '@/components/ui/use-toast'
import { useAtom } from 'jotai'
import { User } from '@/openapi/client'
import { sdk, ZERO_ADDRESS } from '@/constants/data'
import { userApi, scanProfile, getUserProfile } from '@/service'
import { useAsyncEffect } from 'ahooks'
import { LoadingCards } from '@/components/loading-cards'
import GitHubCalendar from 'react-github-calendar'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'

const programmingLanguagesData = [
  { skill: 'JavaScript', value: 95, fullMark: 100 },
  { skill: 'Python', value: 85, fullMark: 100 },
  { skill: 'Go', value: 70, fullMark: 100 },
  { skill: 'Rust', value: 60, fullMark: 100 },
  { skill: 'TypeScript', value: 90, fullMark: 100 },
  { skill: 'Java', value: 65, fullMark: 100 },
]

const techStackData = [
  { skill: 'React', value: 92, fullMark: 100 },
  { skill: 'Next.js', value: 88, fullMark: 100 },
  { skill: 'Node.js', value: 80, fullMark: 100 },
  { skill: 'Docker', value: 75, fullMark: 100 },
  { skill: 'Kubernetes', value: 65, fullMark: 100 },
  { skill: 'AWS', value: 70, fullMark: 100 },
]

const achievements = [
  { icon: <Code className="h-5 w-5" />, label: 'Code Master' },
  { icon: <Bug className="h-5 w-5" />, label: 'Bug Hunter' },
  { icon: <Users className="h-5 w-5" />, label: 'Team Lead' },
  { icon: <Trophy className="h-5 w-5" />, label: 'Top Contributor' },
  { icon: <Github className="h-5 w-5" />, label: 'Open Source Star' },
  { icon: <TerminalSquare className="h-5 w-5" />, label: 'Polyglot Programmer' },
]

const detailedSkills = [
  { name: '代码质量', rating: 4.9, stars: 5 },
  { name: '沟通能力', rating: 4.7, stars: 5 },
  { name: '项目交付', rating: 4.8, stars: 5 },
  { name: '技术创新', rating: 4.6, stars: 5 },
]

const chartConfig = {
  value: { label: 'Proficiency', color: 'hsl(var(--chart-1))' },
}

const StarRating = ({
  rating,
  totalStars = 5,
  className,
  starSize = 'w-4 h-4',
}: {
  rating: number
  totalStars?: number
  className?: string
  starSize?: string
}) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0)

  return (
    <div className={cn('flex items-center', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn(starSize, 'fill-yellow-400 text-yellow-400')} />
      ))}
      {halfStar && (
        <div key="half" className={cn(starSize, 'relative')}>
          <Star className={cn(starSize, 'absolute inset-0 text-yellow-400/30')} />
          <Star
            className={cn(starSize, 'absolute inset-0 fill-yellow-400 text-yellow-400')}
            style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
          />
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn(starSize, 'text-yellow-400/30')} />
      ))}
    </div>
  )
}

const LockedOverlay = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center rounded-lg bg-black/50 backdrop-blur-sm"
    onClick={onClick}
  >
    <Lock className="h-10 w-10 text-primary-foreground/80" />
    <p className="text-md mt-2 font-semibold text-primary-foreground/90">Locked</p>
  </div>
)

export default function ProfilePage() {
  const [userPoints, setUserPoints] = useState('')
  const [totalRewards, setTotalRewards] = useState(0)
  const [claimedRewards, setClaimedRewards] = useState(0)
  const [loading, setLoading] = useState(true)
  const [username] = useUsername()
  const [profile, setProfile] = useState<User>()
  const [claiming, setClaiming] = useState(false)
  const { toast } = useToast()
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)

  const [walletState] = useAtom(walletAtom)
  const linkedAddress = walletState.linkedAddress
  const isFeatureLocked = true

  const [token] = useToken()
  console.log('token', token)

  const scanMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('No token')
      return scanProfile(token, false)
    },
    onSuccess: () => {
      toast({ title: 'Scan started', description: 'Your GitHub repo is being scanned.' })
      setShowUnlockDialog(false)
    },
    onError: (err: unknown) => {
      let msg = 'Scan failed'
      if (err instanceof Error) msg = err.message
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    },
  })

  const userProfileQuery = useQuery({
    queryKey: ['userProfile', token],
    queryFn: () => {
      if (!token) throw new Error('No token')
      return getUserProfile(token)
    },
    enabled: !!token,
  })

  useAsyncEffect(async () => {
    if (!username) return

    try {
      const profileData = await userApi.userControllerMyInfo().then((res) => res.data)
      setProfile(profileData)

      if (linkedAddress && linkedAddress !== ZERO_ADDRESS) {
        const [points, totalRewardsData, claimedRewardsData] = await Promise.all([
          sdk.client.getUserPoints(linkedAddress),
          sdk.client.getTotalRewards(linkedAddress),
          sdk.client.getClaimedRewards(linkedAddress),
        ])

        setUserPoints(points.toString())
        setTotalRewards(Number(totalRewardsData) / 10 ** 18)
        setClaimedRewards(Number(claimedRewardsData) / 10 ** 18)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }, [username, linkedAddress])

  if (loading) {
    return <LoadingCards />
  }

  return (
    <div className="min-h-screen bg-background p-4 text-foreground md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">
          {/* 左侧卡片：个人信息 */}
          <Card className="w-full max-w-xs border-primary/20 bg-card/50 backdrop-blur-sm lg:w-[340px]">
            <div className="flex flex-row items-center gap-4 px-4 py-2">
              <div className="relative ml-4 mr-4">
                <Avatar className="h-20 w-20 border-4 border-primary shadow-lg md:h-24 md:w-24">
                  <AvatarImage src={profile?.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{profile?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 animate-pulse rounded-full ring-4 ring-primary ring-offset-4 ring-offset-background" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">
                  {profile?.displayName || profile?.username}
                </h1>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">{profile?.bio || 'No bio...'}</p>
                <div className="mt-2 flex flex-row justify-start gap-2">
                  <a href={`https://github.com/${profile?.username}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github className="mr-2 h-4 w-4" /> GitHub
                    </Button>
                  </a>
                  <a
                    href={`https://opencampus-codex.blockscout.com/address/${linkedAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Wallet className="mr-2 h-4 w-4" /> Wallet
                    </Button>
                  </a>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-4 md:gap-6">
                  <div>
                    <p className="text-xl font-bold">{profile?.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{profile?.following}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative min-w-0 rounded-lg border border-primary/10 bg-card/30 px-6 py-2">
            <CardHeader className="px-5 py-2">
              <CardTitle>Contribution Heatmap</CardTitle>
              <CardDescription>An overview of activity in the past year</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-1 pt-0">
              <div className="flex flex-wrap justify-center gap-0.5">
                <GitHubCalendar username={profile?.username || ''} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 右侧卡片：开发者评分 */}
          <Card className="relative flex flex-1 flex-col justify-center rounded-lg border border-primary/10 bg-card/30 p-6">
            {isFeatureLocked && <LockedOverlay onClick={() => setShowUnlockDialog(true)} />}
            <div
              className={cn(
                'flex flex-1 flex-col items-center justify-center text-center',
                isFeatureLocked && 'blur-sm',
              )}
            >
              <h3 className="mb-3 text-xl font-semibold text-primary">Developer Rating</h3>
              <p className="text-6xl font-bold text-yellow-400">4.8</p>
              <StarRating rating={4.8} starSize="w-6 h-6" className="my-2" />
              <p className="mb-3 text-sm text-muted-foreground">Based on 156 reviews</p>
              <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white">
                <TrendingUp className="mr-2 h-4 w-4" />
                Outperformed 92% of developers
              </div>
            </div>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm md:col-span-1">
            <CardHeader className="px-5 py-4">
              <div className="flex items-center gap-2">
                <CardTitle>Programming Languages</CardTitle>
              </div>
              <CardDescription>Proficiency in each programming language</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-0">
              <div className="h-64 w-full md:h-72">
                <ChartContainer config={chartConfig}>
                  <RadarChart data={programmingLanguagesData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Proficiency"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.4)"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Skills Card */}
          <Card className="relative border-primary/20 bg-card/50 backdrop-blur-sm md:col-span-1">
            {isFeatureLocked && <LockedOverlay onClick={() => setShowUnlockDialog(true)} />}
            <div className={cn(isFeatureLocked && 'blur-sm')}>
              <CardHeader className="px-5 py-4">
                <CardTitle>Detailed Skill Ratings</CardTitle>
                <CardDescription>Comprehensive ratings for various soft skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-5 pb-4 pt-0">
                {detailedSkills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {skill.name === '代码质量'
                        ? 'Code Quality'
                        : skill.name === '沟通能力'
                        ? 'Communication'
                        : skill.name === '项目交付'
                        ? 'Project Delivery'
                        : skill.name === '技术创新'
                        ? 'Technical Innovation'
                        : skill.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <StarRating rating={skill.rating} totalStars={skill.stars} />
                      <span className="w-8 text-right text-sm font-bold text-cyan-400">{skill.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm md:col-span-1">
            <CardHeader className="px-5 py-4">
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Honors and milestones obtained</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 px-5 pb-4 pt-0 sm:grid-cols-3">
              {achievements.map((ach, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 rounded-lg bg-muted p-3 text-center transition-colors hover:bg-muted/80"
                >
                  <div className="rounded-full bg-primary/10 p-3 text-primary">{ach.icon}</div>
                  <span className="text-xs font-medium">{ach.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* 解锁提示弹窗 */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <div className="p-6 text-center">
            <h2 className="mb-2 text-xl font-bold">Unlock Feature</h2>
            <p className="mb-4">Please scan your GitHub repo to unlock this feature.</p>
            <div className="mt-6 flex justify-between gap-4">
              <Button variant="outline" onClick={() => setShowUnlockDialog(false)}>
                Close
              </Button>
              <Button variant="default" onClick={() => scanMutation.mutate()} disabled={scanMutation.isLoading}>
                {scanMutation.isLoading ? 'Scanning...' : 'Scan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
