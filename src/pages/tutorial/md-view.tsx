import React from 'react'
import { useMd } from '@/components/md-renderer'
interface IMarkdownRendererProps {
  content: string
}

const MdView = ({ content }: IMarkdownRendererProps) => {
  const { MdRenderer, TocSidebar } = useMd(content, true)

  return (
    <div className="flex w-full justify-center">
      {MdRenderer && <MdRenderer className="w-[752px]" />}
      {TocSidebar && <TocSidebar className="hidden lg:block sticky top-0 h-screen overflow-y-auto px-8 w-[312px]" />}
    </div>
  )
}

export default MdView
