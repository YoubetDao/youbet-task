import { Link, useLocation } from 'react-router-dom'

import { navItems } from '@/constants/data'
import { Icons } from '@/components/icons'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const location = useLocation()
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => {
        if (item.hideInMenu) return null

        const Icon = item.icon ? Icons[item.icon] : () => null
        const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              'flex items-center gap-4 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground',
              isActive && 'bg-muted text-foreground',
            )}
          >
            <Icon className="w-4 h-4" />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
