'use client'

import { useState } from 'react'
import { LoadingCards } from '@/components/loading-cards'
import { useUsername, walletAtom } from '@/store'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { userApi } from '@/service'
import { sdk, ZERO_ADDRESS } from '@/constants/data'
import { useAtom } from 'jotai'
import { useAsyncEffect } from 'ahooks'
import { UserProfileDto } from '@/openapi/client'
import ProfileBanner from './_components/profile-banner'
import EmptyCart from './_components/empty-cart'
import Badges from './_components/badges'
import ContributionsGraph from './_components/contributions-graph'
import Scope, { ScopeItem } from './_components/scope'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, Scan } from 'lucide-react'
import ProgramLanguage, { Languages } from './_components/program-language'
import SkillSet from './_components/skillset'
import ComingSoon from './_components/coming-soon'

export default function ProfilePage() {
  const [userPoints, setUserPoints] = useState('')
  const [totalRewards, setTotalRewards] = useState(0)
  const [claimedRewards, setClaimedRewards] = useState(0)
  const [scopeData, setScopeData] = useState<ScopeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [username] = useUsername()
  const [profile, setProfile] = useState<UserProfileDto>()
  const [claiming, setClaiming] = useState(false)
  const { toast } = useToast()
  const [isScanning, setIsScanning] = useState(false)

  const [walletState] = useAtom(walletAtom)
  const linkedAddress = walletState.linkedAddress

  const fetchRewards = async () => {
    const totalRewards = await sdk.client.getTotalRewards(linkedAddress)
    setTotalRewards(Number(totalRewards) / 10 ** 18)

    const claimedRewards = await sdk.client.getClaimedRewards(linkedAddress)
    setClaimedRewards(Number(claimedRewards) / 10 ** 18)
  }

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

        setScopeData([
          { id: 1, label: 'Points', value: points.toString() },
          { id: 2, label: 'Rewards', value: (Number(totalRewardsData) / 10 ** 18).toFixed(5) },
          { id: 3, label: 'Claimed', value: (Number(claimedRewardsData) / 10 ** 18).toFixed(5) },
        ])
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setLoading(false)
    }
  }, [username, linkedAddress])

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

  // TODO: 当前轮询，需要后端优化为通知
  const handleScan = async () => {
    try {
      const scanData = await userApi.userControllerScanProfile().then((res) => res.data)
      console.log('Scan result:', scanData)
      if ((scanData as any)?.jobId) {
        setIsScanning(true)
      }

      const intervalId = setInterval(async () => {
        try {
          const updatedProfile = await userApi.userControllerMyInfo().then((res) => res.data)
          if (updatedProfile.scanStatus === 'Completed') {
            // console.log('Polling profile:', updatedProfile)
            setProfile(updatedProfile)
            setIsScanning(false)
            clearInterval(intervalId)
          }
        } catch (pollError) {
          console.error('Error polling profile:', pollError)
        }
      }, 10000)
    } catch (error) {
      console.error('Error scanning profile:', error)
    }
  }

  if (loading) {
    return <LoadingCards />
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {profile && (
          <div className="col-span-full">
            <ProfileBanner profile={profile} />
          </div>
        )}

        <div className="col-span-full">
          <Card className="mb-4">
            <div className="flex items-center justify-between rounded-lg px-6 py-4">
              <div className="flex items-center gap-2 text-base text-muted-foreground">
                {profile?.scanUpdatedAt ? (
                  <>
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {`Update Date: ${new Date(profile.scanUpdatedAt).toLocaleDateString('zh-CN', {
                        timeZone: 'Asia/Shanghai',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}`}
                    </span>
                  </>
                ) : (
                  <span>Please scan your Github repo by clicking the right button</span>
                )}
              </div>
              <Button
                variant="outline"
                className="flex items-center bg-primary px-6 py-2 text-base font-semibold text-white hover:bg-purple-600"
                onClick={handleScan}
                disabled={isScanning}
              >
                <Scan className="mr-2 h-4 w-4" />
                Scan Now
              </Button>
            </div>
          </Card>
        </div>

        {/* 左侧区域 */}
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-2">
          {profile && (
            <ContributionsGraph username={profile.username} contributedRepos={profile.contributedRepos ?? []} />
          )}
          <Card className="border-gray-700 bg-card">
            <CardHeader>
              <CardTitle>Technical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {profile?.languages ? (
                  <ProgramLanguage languages={profile.languages as Languages} />
                ) : (
                  <EmptyCart title="Language" description="Null technical languages" />
                )}

                {/* <EvaluateRadar isScanning={isScanning} /> */}
                <ComingSoon title="Evaluate" description="Know your technical level" />
              </div>
            </CardContent>
          </Card>

          {profile?.skillset ? (
            <SkillSet skillset={profile?.skillset} isScanning={isScanning} />
          ) : (
            <EmptyCart title="Skills" description="Null technical skills" />
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          {/* <EmptyCart title="Achievement" /> */}
          <ComingSoon title="Points" description="Know your points" />
          {/* <AchievementGauge score={88} percent={92.73} /> */}
          <Scope scopeItems={scopeData} />
          <Badges achievements={profile?.achievements} />
        </div>
      </div>
    </TooltipProvider>
  )
}
