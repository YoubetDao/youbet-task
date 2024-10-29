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
import { CustomConnectButton } from './ConnectButton'
import { cn } from '@/lib/utils'
import { userPermissionAtom, store, tokenAtom, usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import Sidebar from './Sidebar'

export default function Header() {
  const navigate = useNavigate()
  const [token, setToken] = useAtom(tokenAtom)

  const handleLogout = () => {
    setToken(null)
    store.set(usernameAtom, null)
    store.set(userPermissionAtom, null)
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sidebar isMobile={true} />
      <div className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto rounded-full border')}>
        <CustomConnectButton />
      </div>

      {token ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
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
      ) : (
        <Button variant="secondary" className="space-x-2 rounded-full" onClick={handleLogin}>
          <Github className="h-5 w-5" />
          <span>Login</span>
        </Button>
      )}
    </header>
  )
}
