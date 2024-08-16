import { MarkdownProcessor } from '@/lib/md-processor'
import { throttle } from 'lodash'
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

interface IMarkdownRendererProps extends React.HTMLAttributes<HTMLElement> {
  content: string
}

const MdRenderer = forwardRef<HTMLElement, IMarkdownRendererProps>(({ content, ...props }, ref) => {
  return (
    <div {...props}>
      <article
        ref={ref}
        className="prose dark:prose-invert max-w-none full-width-article"
        dangerouslySetInnerHTML={{ __html: content }}
      />
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
      <ul className="space-y-1">
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

export const useMd = (content: string, toc?: boolean) => {
  const mdProcessor = useMemo(() => new MarkdownProcessor(content), [content])

  const contentRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState('')

  const throttledSetActiveId = throttle((id: string) => {
    setActiveId(id)
  }, 500)

  useEffect(() => {
    if (!toc) return

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -70% 0px',
      threshold: 0.2,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting)

      let minYEntry: IntersectionObserverEntry | null = null

      intersectingEntries.forEach((entry) => {
        const rect = entry.boundingClientRect
        // 寻找 y 坐标最小的那个元素
        if (!minYEntry || rect.top < minYEntry.boundingClientRect.top) {
          minYEntry = entry
        }
      })

      throttledSetActiveId(minYEntry!.target.id)
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const elements = contentRef.current?.querySelectorAll('h1, h2, h3') as NodeListOf<HTMLElement>
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [toc, throttledSetActiveId])

  if (toc) {
    return {
      MdRenderer: (props: React.HTMLProps<HTMLElement>) => (
        <MdRenderer {...props} content={mdProcessor.getContentHtml()} ref={contentRef} />
      ),
      TocSidebar: (props: React.HTMLProps<HTMLElement>) => (
        <TocSidebar {...props} toc={mdProcessor.getTocData()} activeId={activeId} />
      ),
    }
  }
  return {
    MdRenderer: (props: React.HTMLProps<HTMLElement>) => (
      <MdRenderer {...props} content={mdProcessor.getContentHtml()} />
    ),
  }
}
