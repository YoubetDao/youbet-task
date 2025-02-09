import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Info } from 'lucide-react'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { LoadingCards } from '@/components/loading-cards'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import { PeriodReport } from '@/types'
import { fetchProjectReports } from '@/service'

interface ReportsProps {
  project: string
}

export default function Reports({ project }: ReportsProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<PeriodReport | null>(null)

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['project-reports', project],
    queryFn: () => fetchProjectReports(project),
  })
  console.log(reports)

  const handleDetailClick = (report: PeriodReport) => {
    setSelectedReport(report)
    setIsDetailOpen(true)
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

      <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-xl font-bold">{selectedReport?.title}</DrawerTitle>
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
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
