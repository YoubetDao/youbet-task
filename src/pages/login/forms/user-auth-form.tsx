import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import ReactGA from 'react-ga4'
import { githubOAuthUri } from '@/lib/auth'

const GithubSignInButton = () => {
  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          ReactGA.event({
            category: 'User',
            action: 'Clicked Login',
            label: 'GitHub',
          })
        }
        window.location.href = githubOAuthUri()
      }}
    >
      <Icons.github className="mr-2 h-4 w-4" />
      Continue with Github
    </Button>
  )
}

export default function UserAuthForm() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Continue with</span>
        </div>
      </div>
      <GithubSignInButton />
    </>
  )
}
