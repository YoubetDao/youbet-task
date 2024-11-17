import { useParams } from 'react-router-dom'
import MdView from './md-view'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { getMdBookContent } from '@/service'
import { useAtomValue } from 'jotai'
import { tutorialToCAtom } from '@/store'
import { Chapter } from '@/types'
import { Button } from '@/components/ui/button'
import { Link, Pen } from 'lucide-react'

function Skeleton() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

const findTitle = (tutorialToC: Chapter[] | null, path: string): string | null => {
  if (tutorialToC === null) {
    return null
  }
  let found = null
  for (const chapter of tutorialToC) {
    if (chapter.path === path + '.md') {
      return chapter.title
    }
    if (chapter.children) {
      found = findTitle(chapter.children, path)
      if (found) {
        return found
      }
    }
  }
  return found
}

const Tutorial = () => {
  const { path, owner, repo } = useParams()
  const tutorialToC = useAtomValue(tutorialToCAtom)
  let title: string | null
  if (path) {
    title = findTitle(tutorialToC, path)
  } else {
    title = 'Not Found'
  }

  const [content, setContent] = useState('#no found')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      if (path && owner && repo) {
        try {
          setLoading(true)
          const response = await getMdBookContent(owner, repo, encodeURIComponent(path))
          setContent(response)
        } catch (error) {
          console.error('Error fetching content:', error)
          setContent('# Error fetching content')
        } finally {
          setLoading(false)
        }
      }
    }
    fetchContent()
  }, [path, owner, repo])

  return (
    <div className="flex flex-col">
      <article className="mx-auto max-w-7xl px-4 py-4 lg:px-12">
        <header className="mb-8 flex flex-row justify-between">
          <h1 className="max-w-[720px] flex-1 break-words text-start text-5xl font-bold">{title ?? 'Not Found'}</h1>
          <section className="flex h-12 flex-row gap-2">
            <Button variant="outline" title="Source">
              <a
                className="flex flex-row items-center justify-center gap-2"
                href={`https://github.com/${owner}/${repo}/blob/master/src/${decodeURIComponent(path ?? '')}.md`}
              >
                <Link size={14} />
              </a>
            </Button>
            <Button variant="outline" title="Edit">
              <a
                className="flex flex-row items-center justify-center gap-2"
                href={`https://github.com/${owner}/${repo}/blob/master/src/${decodeURIComponent(path ?? '')}.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Pen size={14} />
              </a>
            </Button>
          </section>
        </header>
        {loading ? <Skeleton /> : <MdView content={content} />}
      </article>
    </div>
  )
}

export default Tutorial
