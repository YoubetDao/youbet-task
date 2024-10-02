import { COMPANY_NAME, SOCIAL_LINKS } from '@/lib/config'

export default function Footer() {
  return (
    <div className="py-6 border-t border-muted-100 sm:py-10">
      <div className="flex flex-col items-center justify-center gap-8 px-6 mx-auto max-w-7xl sm:flex-row lg:px-8">
        <p className="text-sm leading-7 text-foreground">&copy; {COMPANY_NAME}, Inc. All rights reserved.</p>
        <div className="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-muted-200" />
        <div className="flex gap-x-4">
          {SOCIAL_LINKS.map((item, itemIdx) => (
            <a key={itemIdx} href={item.href} className="relative text-foreground hover:text-foreground">
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="w-6 h-6" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
