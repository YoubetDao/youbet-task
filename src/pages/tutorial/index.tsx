import { useParams } from 'react-router-dom'
import MdView from './md-view'
import { useEffect, useState } from 'react'
import { getMdBookContent } from '@/service'
import { useTutorialToC } from '@/store'
import { Chapter } from '@/types'
import { Button } from '@/components/ui/button'
import { Link, Pen } from 'lucide-react'
import { LoadingCards } from '@/components/loading-cards'

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
  const [tutorialToC] = useTutorialToC()
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
          console.log(owner, repo, path)
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
            <Button
              variant="outline"
              title="Source"
              onClick={() =>
                window.open(`https://github.com/${owner}/${repo}/blob/master/src/${decodeURIComponent(path ?? '')}.md`)
              }
            >
              <Link size={14} />
            </Button>
            <Button
              variant="outline"
              title="Edit"
              onClick={() =>
                window.open(`https://github.com/${owner}/${repo}/blob/master/src/${decodeURIComponent(path ?? '')}.md`)
              }
            >
              <Pen size={14} />
            </Button>
          </section>
        </header>
        {loading ? <LoadingCards /> : <MdView content={content} />}
      </article>
    </div>
  )
}

export default Tutorial
