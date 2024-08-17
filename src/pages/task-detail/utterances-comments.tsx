import { Task } from '@/types'
import React, { useEffect, useRef } from 'react'

const UtterancesComments = ({ task }: { task: Task }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (task.htmlUrl === undefined) {
      return
    }

    const repo = task.htmlUrl.split('/')[3] + '/' + task.htmlUrl.split('/')[4]
    const issueNumber = task.htmlUrl.split('/')[6]

    const script = document.createElement('script')

    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', repo)
    script.setAttribute('issue-number', issueNumber)
    script.setAttribute('theme', 'github-dark')
    script.crossOrigin = 'anonymous'
    script.defer = true

    // Append script and attempt to remove the element after it's loaded
    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }
  }, [task])

  return <div ref={containerRef} />
}

export default UtterancesComments
