import { MarkdownProcessor } from '@/lib/md-processor'
import React, { forwardRef, useMemo } from 'react'

interface IMarkdownRendererProps extends React.HTMLAttributes<HTMLElement> {
  content: string
}

const MdRenderer = forwardRef<HTMLElement, IMarkdownRendererProps>(({ content, ...props }, ref) => {
  return (
    <div {...props}>
      <article ref={ref} {...props} className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
})

interface ITocSidebarProps extends React.HTMLAttributes<HTMLElement> {
  toc: { id: string; title: string; slug: string }[]
  activeId?: string
}

const TocSidebar = ({ toc, activeId, ...props }: ITocSidebarProps) => {
  return (
    <aside {...props}>
      <ul className="space-y-1 border-l gradient-border pl-4">
        {toc.map(({ id, title, slug }) => (
          <li key={title} className={`${id} toc-item ${activeId === slug ? 'active' : ''}`}>
            <a href={`#${slug}`}>{title}</a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

MdRenderer.displayName = 'MdRenderer'

export const useMd = (content: string, toc?: { activeId?: string; contentRef?: React.RefObject<HTMLElement> }) => {
  const mdProcessor = useMemo(() => new MarkdownProcessor(content), [content])
  if (toc) {
    return {
      MdRenderer: (props: React.HTMLProps<HTMLElement>) => (
        <MdRenderer {...props} content={mdProcessor.getContentHtml()} ref={toc.contentRef} />
      ),
      TocSidebar: (props: React.HTMLProps<HTMLElement>) => (
        <TocSidebar {...props} toc={mdProcessor.getTocData()} activeId={toc.activeId} />
      ),
    }
  }
  return {
    MdRenderer: (props: React.HTMLProps<HTMLElement>) => (
      <MdRenderer {...props} content={mdProcessor.getContentHtml()} />
    ),
  }
}
