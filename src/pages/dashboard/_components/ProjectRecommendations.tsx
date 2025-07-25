import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Project } from '@/openapi/client'
import { LucideStar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProjectRecommendations({ projects }: { projects: Project[] }) {
  return (
    <Card className="w-full bg-transparent bg-gradient-to-r from-white/10 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LucideStar className="h-6 w-6" />
          <span className="font-american-captain translate-y-[3px]">Recommended Projects</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <Link key={index} to={project.htmlUrl}>
              <div className="mb-4 border-b pb-4">
                <Button
                  asChild
                  variant="link"
                  className="z-10 px-0 !text-lg font-semibold"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(project.htmlUrl, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <p>{project.name}</p>
                </Button>
                <p className="text-sm text-gray-400">{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
