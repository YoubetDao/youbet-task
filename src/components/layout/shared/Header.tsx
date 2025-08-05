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
import { useAdminNamespace, useAdminProjects, useToken, useUsername, useUserPermission } from '@/store'
import Sidebar from './Sidebar'

export default function Header() {
  const navigate = useNavigate()
  const [token, setToken] = useToken()
  const [username, setUsername] = useUsername()
  const [, setUserPermission] = useUserPermission()
  const [, setAdminProjects] = useAdminProjects()
  const [, setAdminNamespace] = useAdminNamespace()
  const handleLogout = () => {
    setToken(null)
    setUsername(null)
    setUserPermission(null)
    setAdminProjects(null)
    setAdminNamespace(null)
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between gap-4 border-b px-4 lg:h-[60px] lg:px-6">
      <Sidebar isMobile={true} />
      <div className={cn(buttonVariants({ variant: 'outline' }), 'ml-auto rounded-full border')}>
        <CustomConnectButton />
      </div>

      {token ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="space-x-2 rounded-full">
              <User className="h-5 w-5" />
              <span>{username}</span>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>My Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open('https://t.me/youbetdao', '_blank')}>Support</DropdownMenuItem>
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
