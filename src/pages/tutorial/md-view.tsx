import React, { useState, useEffect, useRef } from 'react'
import TocSidebar from './toc-sidebar'
import { MarkdownProcessor } from '@/lib/md-processor'
import debounce from 'lodash/debounce'
interface IMarkdownRendererProps extends React.HTMLAttributes<HTMLElement> {
  content: string
}

const MdView: React.FC<IMarkdownRendererProps> = ({ content, ...props }) => {
  const mdProcessor = new MarkdownProcessor(content)
  const [activeId, setActiveId] = useState('')
  const contentRef = useRef<HTMLElement>(null)

  const debouncedSetActiveId = debounce((id: string) => {
    setActiveId(id)
  }, 100) // 100ms 去抖动时间

  useEffect(() => {
    if (!contentRef.current) return

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -70% 0px',
      threshold: 1,
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          debouncedSetActiveId(entry.target.id)
          break
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    const elements = contentRef.current.querySelectorAll('h1, h2, h3') as NodeListOf<HTMLElement>
    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [debouncedSetActiveId])

  return (
    <div className="flex w-full justify-center">
      <div className="w-[752px]">
        <article
          ref={contentRef}
          {...props}
          className="prose dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: mdProcessor.getContentHtml() }}
        />
      </div>
      <TocSidebar toc={mdProcessor.getTocData()} activeId={activeId} />
    </div>
  )
}

export default MdView
