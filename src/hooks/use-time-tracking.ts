import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

export const useTimeTracking = () => {
  const location = useLocation()

  useEffect(() => {
    const startTime = Date.now()

    return () => {
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        const endTime = Date.now()
        const timeSpent = endTime - startTime
        ReactGA.event({
          category: 'User',
          action: 'Time Spent',
          label: location.pathname,
          value: Math.round(timeSpent / 1000), // Convert to seconds
        })
      }
    }
  }, [location])
}
