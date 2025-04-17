import { Card } from '@/components/ui/card'
import { Github, Star } from 'lucide-react'
import { userApi } from '@/service/openApi'
import { useMount } from 'ahooks'
import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface ContributedRepo {
  fullName: string
  url: string
  stargazerCount: number
  contributions: number
}

interface ProfileResponse {
  status: string
  data: {
    data: {
      contributedRepos: ContributedRepo[]
    }
  }
}

interface Props {
  userName: string
}

export function ContributedTo({ userName }: Props) {
  const [contributions, setContributions] = useState<ContributedRepo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useMount(async () => {
    if (!userName) return

    try {
      setIsLoading(true)
      setError(null)
      const response = (await userApi.userControllerGetProfileOverview(userName)) as unknown as ProfileResponse
      console.log('API Response:', response)

      if (response?.data?.data?.contributedRepos) {
        setContributions(response.data.data.contributedRepos)
      } else {
        console.log('No contributions data:', response)
        setError('No contributions data available')
      }
    } catch (error) {
      console.error('Error fetching contribution data:', error)
      setError('Failed to load contributions')
    } finally {
      setIsLoading(false)
    }
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-400">{error}</div>
      </Card>
    )
  }

  if (!contributions || contributions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-gray-400">No contributions found</div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Contributed To</h2>
      <div className="space-y-4">
        {contributions.map((repo) => (
          <div
            key={repo.fullName}
            className="group relative flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                <Github className="h-5 w-5 text-purple-400" />
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-white transition-colors hover:text-purple-400"
                >
                  {repo.fullName}
                </a>
                <span className="text-sm text-gray-400">{repo.contributions} contributions</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-400">{repo.stargazerCount.toLocaleString()}</span>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </Card>
  )
}
