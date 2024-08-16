import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

import { navItems } from '@/constants/data'
import { Icons } from '@/components/icons'

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetTitle>
          <img src="/logo.png" alt="YouBet Task" className="inline-block w-6 h-6 mr-2 rounded-lg" />
          YouBet Task
        </SheetTitle>
        <nav className="grid gap-2 text-lg font-medium">
          {/* <Link to="#" className="flex items-center gap-2 text-lg font-semibold">
            <Package2 className="w-6 h-6" />
            <span className="sr-only">YouBet Task</span>
          </Link> */}
          {navItems.map((item) => {
            if (item.hideInMenu) return null
            const Icon = item.icon ? Icons[item.icon] : () => null
            return (
              <Link
                key={item.title}
                to={item.href}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
