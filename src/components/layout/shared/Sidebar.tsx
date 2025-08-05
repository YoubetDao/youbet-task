import { Link, useLocation } from 'react-router-dom'
import { getNavItems } from '@/constants/data'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
import useLocalStorageState from '@/hooks/use-localstorage-state'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { BRAND_NAME, BRAND_LOGO, SOCIAL_LINKS } from '@/lib/config'
import { useAdminNamespace, useAdminProjects, useUserPermission } from '@/store'

interface ISidebarProps {
  isMobile?: boolean
}

export default function Sidebar({ isMobile }: ISidebarProps) {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useLocalStorageState<string[]>('sidebarExpandedItems', [])
  const [userPermission] = useUserPermission()
  const [adminProject] = useAdminProjects()
  const [adminNamespace] = useAdminNamespace()

  const isAdminProjects = (adminProject && adminProject?.length > 0) ?? false
  const isAdminNamespace = (adminNamespace && adminNamespace?.length > 0) ?? false

  const navItems = getNavItems(isAdminProjects, isAdminNamespace)

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const renderMenuItem = (item: (typeof navItems)[0], level = 0) => {
    if (item.hideInMenu) return null

    const Icon = item.icon ? Icons[item.icon] : () => null
    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
    const hasChildren =
      item.children && item.children.length > 0 && item.children.filter((item) => !item.hideInMenu).length > 0
    const isExpanded = expandedItems.includes(item.title)

    return (
      <div key={item.title} className={cn('flex flex-col', level > 0 && 'ml-4')}>
        <Link
          to={item.href}
          className={cn(
            'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
            isActive && 'bg-muted text-foreground',
          )}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault()
              toggleExpand(item.title)
            }
          }}
        >
          <Icon className="h-5 w-5 md:h-4 md:w-4" />
          <span className="flex-1">{item.title}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="mt-1">{item.children?.map((child) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetTitle>
            <img src={BRAND_LOGO} alt="logo" className="mr-2 inline-block h-6 w-6 rounded-lg" />
            {BRAND_NAME}
          </SheetTitle>
          <nav className="mt-4 grid gap-2 text-lg font-medium">{navItems.map((item) => renderMenuItem(item))}</nav>
          <div className="absolute bottom-4 left-0 right-0 px-2 lg:px-4">
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((item, itemIdx) => (
                <a
                  key={itemIdx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <nav className="relative grid h-full items-start px-2 text-sm font-medium lg:px-4">
      <div>{navItems.map((item) => renderMenuItem(item))}</div>
      <div className="absolute bottom-4 left-0 right-0 px-2 lg:px-4">
        <div className="flex gap-4">
          {SOCIAL_LINKS.map((item, itemIdx) => (
            <a
              key={itemIdx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <item.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
