import { Meteors } from '../../ui/meteors'
import { Toaster } from '../../ui/toaster'
import Header from './Header'
import Sidebar from './Sidebar'
import Title from './Title'
import { TutorialToC } from '../tutorial/tutorial-toc'

interface IBaseLayout {
  children: React.ReactNode
  mode?: 'tutorial' | 'default'
}

export default function BaseLayout({ children, mode = 'default' }: IBaseLayout) {
  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[180px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Title />
          </div>
          <div className="mt-6 flex-1">
            <Sidebar />
            {mode === 'tutorial' && (
              <section className="flex flex-col items-start px-4 py-4 text-sm font-medium lg:px-6">
                <TutorialToC />
              </section>
            )}
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
  )
}
