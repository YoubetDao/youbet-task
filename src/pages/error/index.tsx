import { ChevronRightIcon } from 'lucide-react'
import { FOOTER_LINKS, BRAND_LOGO } from '@/lib/config'
import Footer from '@/components/footer'

export default function ErrorPage() {
  return (
    <div className="bg-background">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <img alt="logo" src={BRAND_LOGO} className="mx-auto h-10 w-auto rounded-lg sm:h-12" />
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base font-semibold leading-8 text-foreground">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            This page does not exist
          </h1>
          <p className="mt-4 text-base leading-7 text-foreground sm:mt-6 sm:text-lg sm:leading-8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul role="list" className="divide-muted-900/5 border-muted-900/5 -mt-6 divide-y border-b">
            {FOOTER_LINKS.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="ring-muted-900/10 flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1">
                  <link.icon aria-hidden="true" className="h-6 w-6 text-foreground" />
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
                <div className="flex-none self-center">
                  <ChevronRightIcon aria-hidden="true" className="h-5 w-5 text-foreground" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
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
