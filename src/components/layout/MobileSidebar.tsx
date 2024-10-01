import { Link, useLocation } from 'react-router-dom'
import { Menu, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { getNavItems } from '@/constants/data'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import useLocalStorageState from '@/hooks/use-localstorage-state'

export default function MobileSidebar() {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useLocalStorageState<string[]>('sidebarExpandedItems', [])
  const navItems = getNavItems()

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const renderMenuItem = (item: (typeof navItems)[0], level = 0) => {
    if (item.hideInMenu) return null

    const Icon = item.icon ? Icons[item.icon] : () => null
    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)

    return (
      <div key={item.title} className={cn('flex flex-col', level > 0 && 'ml-4')}>
        <Link
          to={item.href}
          className={cn(
            'flex items-center gap-4 py-2 rounded-xl text-muted-foreground hover:text-foreground',
            isActive && 'bg-muted text-foreground',
          )}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault()
              toggleExpand(item.title)
            }
          }}
        >
          <Icon className="w-5 h-5" />
          <span className="flex-1">{item.title}</span>
          {hasChildren && (
            <span className="ml-auto">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          )}
        </Link>
        {hasChildren && isExpanded && (
          <div className="mt-1">{item.children?.map((child) => renderMenuItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden shrink-0">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle>
          <img src="/logo.png" alt="YouBet Task" className="inline-block w-6 h-6 mr-2 rounded-lg" />
          YouBet Task
        </SheetTitle>
        <nav className="grid gap-2 mt-4 text-lg font-medium">{navItems.map((item) => renderMenuItem(item))}</nav>
      </SheetContent>
    </Sheet>
  )
}
