import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import ReactGA from 'react-ga4'
import { githubOAuthUri } from '@/lib/auth'

const GithubSignInButton = () => {
  // TODO: after login should return to the page that the user was on
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
      <Icons.github className="w-4 h-4 mr-2" />
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
          <span className="px-2 bg-background text-muted-foreground">Continue with</span>
        </div>
      </div>
      <GithubSignInButton />
    </>
  )
}
