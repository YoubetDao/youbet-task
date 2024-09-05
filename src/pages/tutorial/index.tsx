import { useParams } from 'react-router-dom'
import MdView from './md-view'
import { useEffect, useState } from 'react'
import { fetchTutorialContent } from '@/service'
import { SkeletonCard } from '@/components/skeleton-card'

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
const Tutorial = () => {
  const { githubId } = useParams()
  const [content, setContent] = useState('# None Readme Content')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      if (githubId) {
        try {
          setLoading(true)
          const response = await fetchTutorialContent(githubId)
          setContent(response)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching content:', error)
        }
      }
    }

    fetchContent()
  }, [githubId])

  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">{loading ? <Skeleton /> : <MdView content={content} />}</div>
  )
}

export default Tutorial
