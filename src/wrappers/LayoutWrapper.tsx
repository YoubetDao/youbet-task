import { Outlet, useLoaderData } from 'react-router-dom'
import BaseLayout from '@/components/layout/shared/BaseLayout'

export default function LayoutWrapper() {
  const data = useLoaderData() as { title: string; description: string }

  return (
    <BaseLayout title={data?.title} description={data?.description}>
      <Outlet />
    </BaseLayout>
  )
}
