import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { userApi } from '@/service'
import { UserReputationDto } from '@/openapi/client'

interface ReputationData {
  score: number
  taskCount: number
  completed: number
  delayedCompleted: number
  earlyAbandoned: number
  delayedAbandoned: number
}

export default function Reputation() {
  const [reputationData, setReputationData] = useState<ReputationData>({
    score: 0,
    taskCount: 0,
    completed: 0,
    delayedCompleted: 0,
    earlyAbandoned: 0,
    delayedAbandoned: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReputationData = async () => {
      try {
        const response = await userApi.userControllerGetMyReputation()
        const data: UserReputationDto = response.data

        setReputationData({
          score: data.score,
          taskCount: data.taskCount,
          completed: data.details.completed,
          delayedCompleted: data.details.delayedCompleted,
          earlyAbandoned: data.details.earlyAbandoned,
          delayedAbandoned: data.details.delayedAbandoned,
        })
      } catch (error) {
        console.error('Error fetching reputation data:', error)
        // 使用模拟数据作为fallback
        setReputationData({
          score: 7.5,
          taskCount: 20,
          completed: 15,
          delayedCompleted: 3,
          earlyAbandoned: 1,
          delayedAbandoned: 1,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReputationData()
  }, [])

  if (loading) {
    return (
      <Card className="border-gray-700 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Reputation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse">
            <div className="mb-2 h-8 rounded bg-gray-700"></div>
            <div className="mb-4 h-4 w-3/4 rounded bg-gray-700"></div>
            <div className="space-y-3">
              <div className="h-4 rounded bg-gray-700"></div>
              <div className="h-4 rounded bg-gray-700"></div>
              <div className="h-4 rounded bg-gray-700"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-700 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Reputation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reputation Value - 左右结构 */}
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold text-white">{reputationData.score.toFixed(1)}</div>
          <div className="text-right text-sm text-muted-foreground">
            Based on recent
            <br />
            {reputationData.taskCount} tasks
          </div>
        </div>

        {/* Task Performance */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Task Performance</h3>

          {/* Completed */}
          <div className="flex items-center gap-3">
            <span className="text-green-500">✅</span>
            <span className="flex-1 text-sm font-medium text-white">Completed</span>
            <div className="h-2 max-w-[120px] flex-1 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-green-500 transition-all"
                style={{
                  width: `${
                    reputationData.taskCount > 0 ? (reputationData.completed / reputationData.taskCount) * 100 : 0
                  }%`,
                }}
              />
            </div>
            <span className="min-w-[30px] text-sm text-muted-foreground">
              {reputationData.completed}/{reputationData.taskCount}
            </span>
          </div>

          {/* Delayed */}
          <div className="flex items-center gap-3">
            <span className="text-red-500">⏰</span>
            <span className="flex-1 text-sm font-medium text-white">Delayed</span>
            <div className="h-2 max-w-[120px] flex-1 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-red-500 transition-all"
                style={{
                  width: `${
                    reputationData.taskCount > 0
                      ? (reputationData.delayedCompleted / reputationData.taskCount) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="min-w-[30px] text-sm text-muted-foreground">
              {reputationData.delayedCompleted}/{reputationData.taskCount}
            </span>
          </div>

          {/* Abandoned */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500">❌</span>
            <span className="flex-1 text-sm font-medium text-white">Abandoned</span>
            <div className="h-2 max-w-[120px] flex-1 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gray-500 transition-all"
                style={{
                  width: `${
                    reputationData.taskCount > 0
                      ? ((reputationData.earlyAbandoned + reputationData.delayedAbandoned) / reputationData.taskCount) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="min-w-[30px] text-sm text-muted-foreground">
              {reputationData.earlyAbandoned + reputationData.delayedAbandoned}/{reputationData.taskCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
