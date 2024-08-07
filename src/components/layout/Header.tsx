import { User, Github } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import MobileSidebar from './MobileSidebar'
import { CustomConnectButton } from './ConnectButton'
import { cn } from '@/lib/utils'
import { tokenAtom, usernameAtom } from '@/store'
import { useAtom } from 'jotai'

export default function Header() {
  const navigate = useNavigate()
  const [token, setToken] = useAtom(tokenAtom)
  const [, setUsername] = useAtom(usernameAtom)
  const handleLogout = () => {
    setToken(null)
    setUsername(null)
    navigate('/login')
  }
  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <MobileSidebar />
      <div className="flex-1 w-full"></div>
      <div className={cn(buttonVariants({ variant: 'outline' }), 'border rounded-full')}>
        <CustomConnectButton />
      </div>

      {!!token && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!token && (
        <Button variant="secondary" className="space-x-2 rounded-full" onClick={handleLogin}>
          <Github className="w-5 h-5" />
          <span>Login</span>
        </Button>
      )}
    </header>
  )
}
