import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import ReactGA from 'react-ga4'

const CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
const REDIRECT_URI = `${location.origin}/auth/github/callback`

const githubOAuth = () => {
  window.location.href = `http://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user:email,repo`
}

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
        githubOAuth()
      }}
    >
      <Icons.github className="mr-2 w-4 h-4" />
      Continue with Github
    </Button>
  )
}

export default function UserAuthForm() {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-t w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Continue with</span>
        </div>
      </div>
      <GithubSignInButton />
    </>
  )
}
