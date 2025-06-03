import React, { useEffect, useState } from 'react'
import { getLoadMoreProjectList, taskApi } from '@/service'
import {
  Task,
  PeriodControllerGetPeriodsRewardGrantedEnum,
  TaskControllerGetCompletedTasksRewardClaimedEnum,
} from '@/openapi/client'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount, useSwitchChain } from 'wagmi'
import { paymentChain } from '@/constants/data'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PencilLine } from 'lucide-react'
import { RewardDialogForm } from '../period/reward-form'
import { Button } from '@/components/ui/button'
import { useAllowanceCheck } from '@/hooks/useAllowanceCheck'
import { Combobox } from '@/components/combo-box'
import { RewardButton, capitalizeFirstLetter } from '@/components/reward-button'
import { Checkbox } from '@/components/ui/checkbox'
import { BatchGrantDialog, RewardTask } from '../admin/BatchGrantDialog'
import { useUsername } from '@/store'

const statuses = (
  Object.keys(PeriodControllerGetPeriodsRewardGrantedEnum) as Array<
    keyof typeof PeriodControllerGetPeriodsRewardGrantedEnum
  >
).map((key) => ({
  label: key,
  value: PeriodControllerGetPeriodsRewardGrantedEnum[key],
}))

const valueToLabel = Object.entries(PeriodControllerGetPeriodsRewardGrantedEnum).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

const DEFAULT_PAGE_SIZE = 10

function CompletedTaskTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const { switchChain } = useSwitchChain()
  const [urlParam] = useSearchParams('')
  const [projectId, setProjectId] = useState<string | undefined>('')
  const [filterTags] = useState<string[]>([])
  const { address, chain } = useAccount()
  const [rewardState, setRewardState] = useState<string>(PeriodControllerGetPeriodsRewardGrantedEnum.All)
  const pageSize = DEFAULT_PAGE_SIZE
  const [batchGrantTasks, setBatchGrantTasks] = useState<Array<RewardTask>>([])
  const [userName] = useUsername()
  const { data: projects, isLoading: projectLoading } = useQuery(['projects', filterTags, urlParam], async () => {
    return getLoadMoreProjectList({
      offset: 0,
      limit: 1000, // TODO: deal with pagination
      filterTags,
      search: decodeURIComponent(urlParam.get('search') || ''),
      sort: decodeURIComponent(urlParam.get('sort') || ''),
    })
  })

  const key = capitalizeFirstLetter(rewardState)
  const { data: tasks, isLoading: isTasksLoading } = useQuery(
    ['tasks', page, pageSize, projectId || '', rewardState],
    () =>
      taskApi
        .taskControllerGetTasks(
          projectId ?? '',
          '',
          'closed',
          '',
          PeriodControllerGetPeriodsRewardGrantedEnum[key as keyof typeof PeriodControllerGetPeriodsRewardGrantedEnum],
          TaskControllerGetCompletedTasksRewardClaimedEnum.All,
          (page - 1) * pageSize,
          pageSize,
        )
        .then((res) => res.data),
  )

  const handleSelectTask = (task: Task) => {
    if (batchGrantTasks.some((t) => t.id === task._id)) {
      setBatchGrantTasks((prev) => prev.filter((t) => t.id !== task._id))
    } else {
      setBatchGrantTasks((prev) => [
        ...prev,
        {
          taskTitle: task.title,
          amount: Number(task.reward?.amount) / 10 ** Number(task.reward?.decimals) || 0,
          decimals: task.reward?.decimals,
          id: task._id,
          users: task.assignee,
          creator: task.user.login,
        },
      ])
    }
  }

  const handleAllSelectTask = (checked: boolean) => {
    if (checked) {
      const taskUngrantedOrUnclaimed = (tasks?.data || [])
        .filter((x) => !x.rewardGranted || !x.rewardClaimed)
        .map((x) => {
          return {
            taskTitle: x.title,
            amount: Number(x.reward?.amount) / 10 ** Number(x.reward?.decimals) || 0,
            decimals: x.reward?.decimals,
            id: x._id,
            users: x.assignee,
            creator: x.user.login,
          }
        })
      setBatchGrantTasks(taskUngrantedOrUnclaimed)
    } else {
      setBatchGrantTasks([])
    }
  }

  useEffect(() => {
    switchChain({ chainId: paymentChain.id })
  }, [switchChain])

  const totalPages = Math.ceil((tasks?.pagination?.totalCount || 0) / DEFAULT_PAGE_SIZE)

  const { hasAllowance, approveAllowance, checkAllowance, tokenError, tokenLoading } = useAllowanceCheck()

  useEffect(() => {
    checkAllowance()
  }, [checkAllowance])

  // Prepare options for searchable dropdown
  const projectOptions =
    projects?.list.map((project) => ({
      value: project._id.toString(),
      label: project.name,
    })) ?? []

  return (
    <div className="space-y-4">
      <div className="flex justify-items-start space-x-4">
        <Combobox
          options={projectOptions}
          value={projectId ?? ''}
          onSelect={setProjectId}
          placeholder="Select project"
          isLoading={projectLoading}
        />
        <RewardButton
          selected={rewardState}
          pageId="completed"
          rewardState={rewardState}
          setRewardState={setRewardState}
          statuses={statuses}
          valueToLabel={valueToLabel}
          title="Reward"
        />
      </div>
      <div className="flex justify-end">
        <BatchGrantDialog
          defaultRewardTasks={batchGrantTasks}
          rewardType="task"
          trigger={
            <Button
              className="whitespace-nowrap"
              disabled={batchGrantTasks.length === 0 || !hasAllowance || !address || !chain}
            >
              Grant Selected
            </Button>
          }
        />
      </div>
      {!isTasksLoading && tasks ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">
                <Checkbox onCheckedChange={handleAllSelectTask} />
              </TableHead>
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Created At</TableHead>
              <TableHead className="text-gray-400">Completed At</TableHead>
              <TableHead className="text-gray-400">Assignee</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.data?.map((task) => (
              <TableRow key={task._id}>
                <TableCell>
                  <Checkbox
                    disabled={task.rewardClaimed || task.rewardGranted}
                    checked={batchGrantTasks.some((t) => t.id === task._id)}
                    onCheckedChange={() => handleSelectTask(task)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <div>{task?.title}</div>
                    <a
                      href={task?.htmlUrl}
                      className="text-xs text-gray-500 hover:text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {task?._id}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {task.closedAt &&
                    new Date(task.closedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </TableCell>
                <TableCell>
                  {task.assignee && (
                    <img
                      className="h-6 w-6 rounded-full border-2 border-white"
                      src={task.assignee.avatarUrl}
                      alt={task.assignee.login}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {!task.rewardGranted ? (
                    address &&
                    chain &&
                    !tokenError &&
                    !tokenLoading &&
                    hasAllowance !== null &&
                    (hasAllowance ? (
                      <RewardDialogForm
                        trigger={
                          <Button variant="link" className="gap-2 p-0 text-blue-500">
                            <PencilLine size={15} />
                            Grant
                          </Button>
                        }
                        id={task._id}
                        creatorId={userName!}
                        users={task.assignee ? [task.assignee] : []}
                        addressFrom={address}
                        chain={chain}
                        onRewardDistributed={async (data) => {
                          await taskApi.taskControllerGrantRewards(task._id, {
                            contributorRewards: data.users.map((user) => ({
                              contributor: user.login,
                              amount: data.amounts[data.users.indexOf(user)],
                              symbol: data.symbol,
                              decimals: data.decimals,
                            })),
                          })
                        }}
                        defaultAmount={Number(task.reward?.amount) / 10 ** Number(task.reward?.decimals)}
                        sourceType="task"
                      />
                    ) : (
                      <Button
                        variant="link"
                        className="gap-2 p-0 text-blue-500"
                        onClick={async () => {
                          await switchChain({ chainId: paymentChain.id })
                          await approveAllowance()
                        }}
                      >
                        Approve Contract
                      </Button>
                    ))
                  ) : task.rewardClaimed ? (
                    <p>Claimed</p>
                  ) : (
                    <p>Granted</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <LoadingCards />
      )}

      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default function CompletedTaskAdmin() {
  return <CompletedTaskTable />
}
