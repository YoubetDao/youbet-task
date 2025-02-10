import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Info, Share2 } from 'lucide-react'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { LoadingCards } from '@/components/loading-cards'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { PeriodReport } from '@/types'
import { fetchProjectReports } from '@/service'
import { useSearchParams } from 'react-router-dom'

interface ReportsProps {
  project: string
}

export default function Reports({ project }: ReportsProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<PeriodReport | null>(null)

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
            <article
              className={cn(
                'prose-headings:font-bold prose-headings:text-gray-100',
                'prose-p:text-gray-300 prose-li:text-gray-300',
                'prose-strong:text-gray-200 prose-code:text-gray-200',
              )}
            >
              <ReactMarkdown>{selectedReport?.summary || ''}</ReactMarkdown>
            </article>
          </div>
          <DrawerFooter>
            <div className="flex items-center gap-2">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Close
                </Button>
              </DrawerClose>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-800"
                onClick={handleShare}
                title="Share on X (Twitter)"
              >
                <Share2 />
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
