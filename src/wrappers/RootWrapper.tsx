import { Outlet } from 'react-router-dom'
import { usePageTracking } from '@/hooks/use-page-tracking'
import { useTimeTracking } from '@/hooks/use-time-tracking'

export default function RootWrapper() {
  usePageTracking()
  useTimeTracking()
  return (
    <>
      <Outlet />
    </>
  )
}
