import { User, Github } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { tokenAtom, usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

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
    <header className="flex flex-shrink-0 items-center gap-4 bg-muted/40 px-4 lg:px-6 border-b h-14 lg:h-[60px]">
      <MobileSidebar />
      <div className="flex-1 w-full"></div>
      <div>
        <WalletMultiButton />
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
