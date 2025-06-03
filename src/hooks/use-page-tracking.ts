import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [location])
}
