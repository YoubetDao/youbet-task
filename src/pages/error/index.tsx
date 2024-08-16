import { ChevronRightIcon, LucidePackage, LucideBookOpen } from 'lucide-react'

const links = [
  {
    name: 'Projects',
    href: '/projects',
    description: 'View all projects.',
    icon: LucidePackage,
  },
  {
    name: 'Tutorials',
    href: '/tutorials',
    description: 'There are many tutorials to learn from.',
    icon: LucideBookOpen,
  },
]
const social = [
  {
    name: 'X',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
]

export default function ErrorPage() {
  return (
    <div className="bg-background">
      <main className="w-full px-6 pt-10 pb-16 mx-auto max-w-7xl sm:pb-24 lg:px-8">
        <img alt="YouBet" src="/logo.png" className="w-auto h-10 mx-auto rounded-lg sm:h-12" />
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
            {links.map((link, linkIdx) => (
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
      <footer className="py-6 border-t border-muted-100 sm:py-10">
        <div className="flex flex-col items-center justify-center gap-8 px-6 mx-auto max-w-7xl sm:flex-row lg:px-8">
          <p className="text-sm leading-7 text-foreground">&copy; YouBet, Inc. All rights reserved.</p>
          <div className="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-muted-200" />
          <div className="flex gap-x-4">
            {social.map((item, itemIdx) => (
              <a key={itemIdx} href={item.href} className="text-foreground hover:text-foreground">
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
