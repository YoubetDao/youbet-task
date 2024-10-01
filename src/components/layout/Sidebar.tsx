import { Link, useLocation } from 'react-router-dom'
import { getNavItems } from '@/constants/data'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import useLocalStorageState from '@/hooks/use-localstorage-state'

export default function Sidebar() {
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
            'flex items-center gap-4 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground',
            isActive && 'bg-muted text-foreground',
          )}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault()
              toggleExpand(item.title)
            }
          }}
        >
          <Icon className="w-4 h-4" />
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
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => renderMenuItem(item))}
    </nav>
  )
}
