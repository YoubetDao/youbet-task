import React, { useEffect, useRef } from 'react'

const UtterancesComments = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://utteranc.es/client.js'
    script.setAttribute('repo', 'YoubetDao/youbet-test-repo')
    script.setAttribute('issue-number', '15')
    script.setAttribute('theme', 'github-dark')
    script.crossOrigin = 'anonymous'
    script.defer = true

    // Append script and attempt to remove the element after it's loaded
    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }
  }, [])

  return <div ref={containerRef} />
}

export default UtterancesComments
