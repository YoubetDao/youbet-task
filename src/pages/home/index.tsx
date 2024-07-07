import { Helmet } from 'react-helmet'
import Dashboard from '@/components/dashboard'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{'YouBet Task'}</title>
      </Helmet>
      <Dashboard />
    </>
  )
}
