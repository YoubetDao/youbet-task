import { useMd } from '@/components/md-renderer'

interface IMarkdownRendererProps {
  content: string
}

const MdView = ({ content }: IMarkdownRendererProps) => {
  const { MdRenderer, ToCSidebar } = useMd(content, true)

  return (
    <div className="flex w-full flex-col-reverse gap-10 xl:flex-row">
      {MdRenderer && <MdRenderer className="max-w-[720px] flex-1" />}
      {ToCSidebar && <ToCSidebar className="top-0 h-full w-[312px] gap-2 overflow-y-auto py-2 xl:sticky" />}
    </div>
  )
}

export default MdView
