import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
// import { signIn } from 'next-auth/react'
// import { useSearchParams } from 'next/navigation'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Icons } from '@/components/icons'
// import GithubSignInButton from '../github-auth-button'

const CLIENT_ID = 'Ov23li86Nz0RcXbj54Z5'
const REDIRECT_URI = 'http://localhost:3000/auth/github/callback'

const signIn = (...args: unknown[]) => {
  location.href = '/'
}

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

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
})

type UserFormValue = z.infer<typeof formSchema>

export default function UserAuthForm() {
  const searchParams = new URLSearchParams(useLocation().search)
  const callbackUrl = searchParams.get('callbackUrl')
  const [loading, setLoading] = useState(false)
  const defaultValues = {
    email: 'demo@gmail.com',
  }
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: UserFormValue) => {
    signIn('credentials', {
      email: data.email,
      callbackUrl: callbackUrl ?? '/dashboard',
    })
  }

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
