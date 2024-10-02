import { ChevronRightIcon } from 'lucide-react'
import { FOOTER_LINKS, BRAND_LOGO } from '@/lib/config'
import Footer from '@/components/footer'

export default function ErrorPage() {
  return (
    <div className="bg-background">
      <main className="w-full px-6 pt-10 pb-16 mx-auto max-w-7xl sm:pb-24 lg:px-8">
        <img alt="logo" src={BRAND_LOGO} className="w-auto h-10 mx-auto rounded-lg sm:h-12" />
        <div className="max-w-2xl mx-auto mt-20 text-center sm:mt-24">
          <p className="text-base font-semibold leading-8 text-foreground">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            This page does not exist
          </h1>
          <p className="mt-4 text-base leading-7 text-foreground sm:mt-6 sm:text-lg sm:leading-8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
        <div className="flow-root max-w-lg mx-auto mt-16 sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul role="list" className="-mt-6 border-b divide-y divide-muted-900/5 border-muted-900/5">
            {FOOTER_LINKS.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex py-6 gap-x-6">
                <div className="flex items-center justify-center flex-none w-10 h-10 rounded-lg shadow-sm ring-1 ring-muted-900/10">
                  <link.icon aria-hidden="true" className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-foreground">
                    <a href={link.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {link.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-foreground">{link.description}</p>
                </div>
                <div className="self-center flex-none">
                  <ChevronRightIcon aria-hidden="true" className="w-5 h-5 text-foreground" />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-10">
            <a href="/" className="text-sm font-semibold leading-6 text-foreground">
              <span aria-hidden="true">&larr;</span>
              Back to home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
