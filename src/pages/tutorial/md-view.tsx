import React, { useState, useEffect, useRef } from 'react'
import debounce from 'lodash/debounce'
import { useMd } from '@/components/md-renderer'
interface IMarkdownRendererProps {
  content: string
}

const MdView = ({ content }: IMarkdownRendererProps) => {
  const contentRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState('')
  const { MdRenderer, TocSidebar } = useMd(content, { activeId: activeId, contentRef: contentRef })

  const debouncedSetActiveId = debounce((id: string) => {
    setActiveId(id)
  }, 100) // 100ms 去抖动时间

  useEffect(() => {
    console.log(contentRef)
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
      {MdRenderer && <MdRenderer className="w-[752px]" />}
      {TocSidebar && <TocSidebar className="hidden lg:block sticky top-0 h-screen overflow-y-auto px-8 w-[312px]" />}
    </div>
  )
}

export default MdView
