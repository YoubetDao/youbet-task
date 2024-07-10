import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { projectItems } from '@/constants/data'
import { ProjectItem as ProjectItemType } from '@/types'

function ProjectItem({ item }: { item: ProjectItemType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  )
}

export default function Project() {
  return (
    <div className="space-y-4">
      <h1>Project</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projectItems.map((item) => (
          <ProjectItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
