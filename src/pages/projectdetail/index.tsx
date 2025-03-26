import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TaskList from './TaskList'
import Reports from './Reports'

export default function ProjectDetailPage() {
  const { project } = useParams<{ project: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>('tasks')

  // TODO: should controlled by tab parameter?
  // 根据 URL 参数设置初始标签页
  useEffect(() => {
    const activeTabParam = searchParams.get('activeTab')
    if (activeTabParam) {
      setActiveTab(activeTabParam)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    setSearchParams((prev) => {
      // create new URLSearchParams object
      const newParams = new URLSearchParams(prev)
      // set activeTab parameter
      newParams.set('activeTab', value)
      return newParams
    })
  }

  return (
    <>
      <Breadcrumb className="py-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{searchParams.get('projectName')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <TaskList project={project!} />
        </TabsContent>
        <TabsContent value="reports">
          <Reports project={project!} />
        </TabsContent>
      </Tabs>
    </>
  )
}
