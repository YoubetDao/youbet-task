import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { LoadingCards } from '@/components/loading-cards'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { PeriodReport } from '@/types'
import { fetchProjectReports, reportApi } from '@/service'
import { useSearchParams } from 'react-router-dom'
import { ShareButton } from '@/components/share-button'
import { Textarea } from '@/components/ui/textarea'

interface ReportsProps {
  project: string
}

export default function Reports({ project }: ReportsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<PeriodReport | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['project-reports', project],
    queryFn: () => fetchProjectReports(project),
  })

  useEffect(() => {
    const reportId = searchParams.get('report')
    if (reportId && reports.length > 0) {
      const report = reports.find((r) => r._id === reportId)
      if (report) {
        setSelectedReport(report)
        setIsDetailOpen(true)
      }
    }
  }, [searchParams, reports])

  useEffect(() => {
    if (selectedReport) {
      setEditContent(selectedReport.summary || '')
    }
  }, [selectedReport, isEditing])

  const handleDetailClick = (report: PeriodReport) => {
    setSelectedReport(report)
    setIsDetailOpen(true)
    setSearchParams({ report: report._id })
  }

  const handleDrawerClose = () => {
    setIsDetailOpen(false)
    setSearchParams({})
  }

  const handleShare = () => {
    if (!selectedReport) return
    const shareUrl = `${window.location.origin}${window.location.pathname}?report=${selectedReport._id}`
    const text = selectedReport.title
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      '_blank',
    )
  }

  const handleSaveEdit = async () => {
    if (!selectedReport) return

    setIsSaving(true)
    try {
      await reportApi.reportControllerUpdateReport(selectedReport._id, {
        summary: editContent,
        title: selectedReport.title,
      })

      setSelectedReport({
        ...selectedReport,
        summary: editContent,
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update report:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (selectedReport) {
      setEditContent(selectedReport.summary || '')
    }
  }

  if (isLoading) {
    return <LoadingCards />
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">From</TableHead>
            <TableHead className="text-gray-400">To</TableHead>
            <TableHead className="text-gray-400">Issue Count</TableHead>
            <TableHead className="text-gray-400">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report._id}>
              <TableCell className="font-medium">
                {new Date(report.from).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>
                {new Date(report.to).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>{report.issueCount}</TableCell>
              <TableCell>
                <Button variant="link" className="gap-2 p-0 text-blue-500" onClick={() => handleDetailClick(report)}>
                  <Info size={15} />
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer open={isDetailOpen} onOpenChange={handleDrawerClose}>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-2">
                <DrawerTitle className="text-xl font-bold">{selectedReport?.title}</DrawerTitle>
              </div>
            </div>
          </DrawerHeader>
          <div className="prose prose-invert max-h-[calc(100vh-10rem)] max-w-none overflow-y-auto p-6">
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[300px] font-mono text-base"
                  placeholder="编辑报告内容 (支持 Markdown 语法)"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                    取消
                  </Button>
                  <Button onClick={handleSaveEdit} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                    {isSaving ? '保存中...' : '保存'}
                  </Button>
                </div>
              </div>
            ) : (
              <article
                className={cn(
                  'prose-headings:font-bold prose-headings:text-gray-100',
                  'prose-p:text-gray-300 prose-li:text-gray-300',
                  'prose-strong:text-gray-200 prose-code:text-gray-200',
                )}
              >
                <ReactMarkdown>{selectedReport?.summary || ''}</ReactMarkdown>
              </article>
            )}
          </div>
          <DrawerFooter>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="default"
                  className="w-1/2 bg-purple-500 hover:bg-purple-600"
                >
                  编辑
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline" className={isEditing ? 'w-full' : 'w-1/2'}>
                  关闭
                </Button>
              </DrawerClose>
              <ShareButton variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-800" onClick={handleShare} />
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
