import { useMd } from '@/components/md-renderer'

interface IMarkdownRendererProps {
  content: string
}

const MdView = ({ content }: IMarkdownRendererProps) => {
  const { MdRenderer, ToCSidebar } = useMd(content, true)

  return (
    <div className="flex flex-col-reverse w-full gap-10 xl:flex-row">
      {MdRenderer && <MdRenderer className="flex-1 max-w-[720px]" />}
      {ToCSidebar && <ToCSidebar className="xl:sticky top-0 overflow-y-auto h-full w-[312px] py-2 gap-2" />}
    </div>
  )
}

export default MdView
