import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/skeleton-card'
import { Repository } from '@/types'
import { useState, useEffect } from 'react'

function SkeletonProjects() {
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

function ProjectItem({ item }: { item: Repository }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 overflow-hidden rounded">
          <div className="flex items-center mb-4">
            <img className="w-12 h-12 mr-4 rounded-full" src={item.owner.avatar_url} alt="Owner Avatar" />
            <div className="text-sm">
              <p className="leading-none text-gray-900">{item.owner.login}</p>
              <p className="text-gray-600">{item.owner.html_url}</p>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-bold">{item.full_name}</h2>
            <p className="text-base text-gray-700">{item.description}</p>
          </div>
          <div className="mb-4">
            <Button asChild>
              <a target="_blank" href={item.html_url} rel="noreferrer">
                View Repository
              </a>
            </Button>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Stars: {item.stargazers_count}</p>
              <p className="text-gray-600">Forks: {item.forks_count}</p>
            </div>
            <div>
              <p className="text-gray-600">Issues: {item.open_issues_count}</p>
              <p className="text-gray-600">Language: {item.language}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Project() {
  const [projects, setProjects] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const data = await fetch('/api/projects?org=youbetdao')
        .then((res) => res.json())
        .catch(() => [])
      setProjects(data)
      setLoading(false)
    }
    fetchProjects()
  }, [])

  return (
    <div className="space-y-4">
      <h1>Projects</h1>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? <SkeletonProjects /> : projects.map((item) => <ProjectItem key={item.id} item={item} />)}
      </div>
    </div>
  )
}
