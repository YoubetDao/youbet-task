import { Meteors } from '../../ui/meteors'
import { Toaster } from '../../ui/toaster'
import Header from './Header'
import Sidebar from './Sidebar'
import Title from './Title'
import { useInitState } from '../hooks/useInitState'
import { Helmet } from 'react-helmet'
import { BRAND_NAME } from '@/lib/config'

interface IBaseLayout {
  children: React.ReactNode
  mode?: 'default'
  title?: string
  description?: string
}

export default function BaseLayout({ children, mode = 'default', title, description }: IBaseLayout) {
  useInitState()
  return (
    <>
      <Helmet>
        <title>{title ? `${title} - ${BRAND_NAME}` : BRAND_NAME}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      <div className="grid h-screen w-full overflow-hidden md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr]">
        <div className="hidden border-r md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Title />
            </div>
            <div className="mt-6 flex-1">
              <Sidebar />
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main
            className="relative flex flex-1 flex-col gap-4 overflow-auto scroll-smooth p-2 lg:gap-6 lg:p-5"
            id="scrollRef"
          >
            <div className="pointer-events-none fixed bottom-0 left-[220px] right-0 top-14 z-[-1] overflow-hidden md:left-[220px] lg:left-[280px] lg:top-[60px]">
              <Meteors number={20} />
              <div className="absolute bottom-0 right-0">
                <img src="/main-background.svg" alt="background" className="h-auto w-[456px] opacity-30" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="mx-auto max-w-7xl px-4 py-4 lg:px-12">{children}</div>
            </div>
          </main>
          <Toaster />
        </div>
      </div>
    </>
  )
}
