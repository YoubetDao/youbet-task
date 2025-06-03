import { SOCIAL_LINKS } from '@/lib/config'

export default function Footer() {
  return (
    <div className="border-muted-100 border-t py-6 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
        {/* <p className="text-sm leading-7 text-foreground">&copy; {COMPANY_NAME}, Inc. All rights reserved.</p>
        <div className="sm:bg-muted-200 hidden sm:block sm:h-7 sm:w-px sm:flex-none" /> */}
        <div className="flex gap-x-4">
          {SOCIAL_LINKS.map((item, itemIdx) => (
            <a
              key={itemIdx}
              href={item.href}
              className="relative text-foreground hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
