import { Button } from '@/components/ui/button'
// import { signIn } from 'next-auth/react'
// import { useSearchParams } from 'next/navigation'
import { Icons } from '@/components/icons'
// import GithubSignInButton from '../github-auth-button'

const CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID
const REDIRECT_URI = `${location.origin}/auth/github/callback`

const githubOAuth = () => {
  window.location.href = `http://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user:email`
}

const GithubSignInButton = () => {
  // const searchParams = new URLSearchParams(useLocation().search)
  // const callbackUrl = searchParams.get('callbackUrl')

  return (
    <Button className="w-full" variant="outline" type="button" onClick={() => githubOAuth()}>
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
