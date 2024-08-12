import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/skeleton-card'
import { Repository } from '@/types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import http from '@/service/instance'

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
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col justify-between h-full overflow-hidden rounded">
          <div>
            <div className="flex items-center mb-4">
              <img className="w-12 h-12 mr-4 rounded-full" src={item.owner.avatarUrl} alt="Owner Avatar" />
              <div className="text-sm">
                <p className="leading-none text-gray-900">{item.owner.login}</p>
                <p>{item.owner.htmlUrl}</p>
              </div>
            </div>
            <div className="mb-4">
              {/* <h2 className="mb-2 text-xl font-bold">{item.full_name}</h2> */}
              <p className="text-base text-gray-700">{item.description}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p>Stars: {item.stargazersCount}</p>
                <p>Forks: {item.forksCount}</p>
              </div>
              <div>
                <p>Issues: {item.openIssuesCount}</p>
                <p>Language: {item.language}</p>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 mt-8">
            <Button variant="link" asChild>
              <a target="_blank" href={item.htmlUrl} rel="noreferrer">
                View Repository
              </a>
            </Button>
            <Button asChild>
              <Link to={`/projects/${item.name}/tasks`}>View Tasks</Link>
            </Button>
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
      const data = await http
        .get('/projects?org=youbetdao')
        .then((res) => res.data)
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
        {loading ? <SkeletonProjects /> : projects.map((item) => <ProjectItem key={item._id} item={item} />)}
      </div>
    </div>
  )
}
