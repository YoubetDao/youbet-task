import React, { useEffect, useState } from 'react'
import { projectApi } from '@/service'
import { useAccount, useSwitchChain } from 'wagmi'
import { paymentChain } from '@/constants/data'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RewardButton } from '@/components/reward-button'
import { PeriodControllerGetPeriodsRewardGrantedEnum } from '@/openapi/client'
import { Combobox } from '@/components/combo-box'
import { BatchGrantDialog, RewardTask } from '../admin/BatchGrantDialog'
import { useAllowanceCheck } from '@/hooks/useAllowanceCheck'
import { statuses, valueToLabel } from './_constants'
import PeriodTable from './_components/PeriodTable'
import DrawerDetail from './_components/DrawerDetail'

function PeriodAdmin(): React.ReactElement {
  const { switchChain } = useSwitchChain()
  const [urlParam] = useSearchParams('')
  const [projectId, setProjectId] = useState<string | undefined>('')
  const [filterTags] = useState<string[]>([])
  const { address, chain } = useAccount()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('')
  const [rewardState, setRewardState] = useState<string>(PeriodControllerGetPeriodsRewardGrantedEnum.All)
  const [batchGrantPeriods, setBatchGrantPeriods] = useState<Array<RewardTask>>([])

  const { data: projects, isLoading: projectLoading } = useQuery({
    queryKey: ['projects', filterTags, urlParam.toString()],
    queryFn: async () => {
      return projectApi
        .projectControllerGetProjects(
          filterTags.join(','),
          '',
          'true',
          urlParam.get('search') || '',
          urlParam.get('sort') || '',
          0,
          1000,
        )
        .then((res) => res.data)
    },
  })

  useEffect(() => {
    switchChain({ chainId: paymentChain.id })
  }, [switchChain])

  const { hasAllowance, approveAllowance, tokenError, tokenLoading } = useAllowanceCheck()

  const handleDetailClick = (periodId: string) => {
    setSelectedPeriodId(periodId)
    setIsDetailOpen(true)
  }

  const projectOptions =
    projects?.data?.map((project) => ({
      value: project._id.toString(),
      label: project.name,
    })) ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <Combobox
          options={projectOptions}
          value={projectId ?? ''}
          onSelect={setProjectId}
          placeholder="Select project"
          isLoading={projectLoading}
        />
        <RewardButton
          selected={rewardState}
          pageId="period"
          rewardState={rewardState}
          setRewardState={setRewardState}
          statuses={statuses}
          valueToLabel={valueToLabel}
          title="Reward"
        />
      </div>
      <div className="flex justify-end">
        <BatchGrantDialog
          cleanPendingGrantTasks={() => setBatchGrantPeriods([])}
          defaultRewardTasks={batchGrantPeriods}
          rewardType="period"
          trigger={
            <Button
              className="whitespace-nowrap"
              disabled={batchGrantPeriods.length === 0 || !hasAllowance || !address || !chain}
            >
              Grant Selected
            </Button>
          }
        />
      </div>

      <PeriodTable
        handleDetailClick={handleDetailClick}
        switchChain={switchChain}
        projectId={projectId}
        rewardState={rewardState}
        hasAllowance={hasAllowance}
        approveAllowance={approveAllowance}
        tokenError={tokenError}
        tokenLoading={tokenLoading}
      />

      <DrawerDetail selectedPeriodId={selectedPeriodId} isDetailOpen={isDetailOpen} setIsDetailOpen={setIsDetailOpen} />
    </div>
  )
}

export default PeriodAdmin
