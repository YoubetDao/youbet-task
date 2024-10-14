import Sidebar from '@/components/layout/Sidebar'
import Title from '@/components/layout/Title'
import Header from '@/components/layout/Header'
import { Toaster } from '@/components/ui/toaster'
import { Meteors } from '@/components/ui/meteors'

export const description =
  'A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.'

export const iframeHeight = '800px'

export const containerClassName = 'w-full h-full'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Title />
          </div>
          <div className="flex-1">
            <Sidebar />
          </div>
          <div className="mt-auto p-4">{/* <Upgrade /> */}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex flex-1 flex-col gap-4 overflow-auto scroll-smooth p-4 lg:gap-6 lg:p-6" id="scrollRef">
          <div>
            {children}
            <div className="pointer-events-none fixed bottom-0 left-[220px] right-0 top-14 z-[-1] overflow-hidden md:left-[220px] lg:left-[280px] lg:top-[60px]">
              <Meteors number={20} />
            </div>
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  )
}
