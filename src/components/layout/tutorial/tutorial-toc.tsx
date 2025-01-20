import { Fragment } from 'react'
import { Chapter } from '@/types'
import { useParams } from 'react-router-dom'
import { useTutorialToC } from '@/store'

export const TutorialToC = ({ depth = 0, chapters }: { depth?: number; chapters?: Chapter[] }) => {
  const { path } = useParams()
  const [rootToC] = useTutorialToC()
  const tutorialToC = chapters || rootToC

  const renderTitle = (chapter: Chapter, depth: number) => {
    const isActive = path === chapter.path.match(/^(.*?).md$/)?.[1]

    return (
      <li
        id={chapter.path.match(/^(.*?).md$/)?.[1]}
        className={`border-slate-600 py-1   ${depth === 0 ? 'mb-1 border-none pl-1' : 'border-l-2 pl-2'} ${
          depth === 0 && chapter.children?.length === 0 ? 'mb-3' : ''
        }
        ${isActive ? '' : 'cursor-pointer hover:border-slate-500 hover:bg-slate-800'}
        `}
      >
        <a href={isActive ? undefined : encodeURIComponent(chapter.path.match(/^(.*?).md$/)?.[1] || '')}>
          <p
            className={`pl-${depth * 2} break-words text-left text-muted-foreground ${
              depth === 0 ? 'text-white' : ''
            } ${isActive ? '!text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {chapter.title}
          </p>
        </a>
      </li>
    )
  }

  return (
    <ul className="mb-6 flex flex-col">
      {tutorialToC &&
        tutorialToC.map((chapter) => (
          <Fragment key={chapter.path}>
            {renderTitle(chapter, depth)}
            {chapter.children && chapter.children.length > 0 && (
              <TutorialToC depth={depth + 1} chapters={chapter.children} />
            )}
          </Fragment>
        ))}
    </ul>
  )
}
