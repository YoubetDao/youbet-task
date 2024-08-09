import React from 'react'

interface TocSidebarProps {
  toc: { id: string; title: string; slug: string }[]
  activeId: string
}

const TocSidebar: React.FC<TocSidebarProps> = ({ toc, activeId }) => {
  return (
    <aside className="hidden lg:block sticky top-0 h-screen overflow-y-auto px-8 w-[312px]">
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

export default TocSidebar
