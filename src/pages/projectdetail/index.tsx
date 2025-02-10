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
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>('tasks')

  // TODO: should controlled by tab parameter?
  // 根据 URL 参数设置初始标签页
  useEffect(() => {
    const reportId = searchParams.get('report')
    if (reportId) {
      setActiveTab('reports')
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // 如果切换到 tasks tab，清除 report 参数
    if (value === 'tasks') {
      searchParams.delete('report')
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}${searchParams.toString() ? '?' + searchParams.toString() : ''}`,
      )
    }
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
            <BreadcrumbPage>{project}</BreadcrumbPage>
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
