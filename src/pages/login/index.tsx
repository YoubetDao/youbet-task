import { Link, useNavigate } from 'react-router-dom'
import UserAuthForm from '@/components/forms/user-auth-form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import Cookies from 'js-cookie'

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      navigate('/', { replace: true })
    }
  })
  return (
    <>
      <div className="relative flex-col items-center justify-center h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/examples/authentication"
          className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 hidden md:right-8 md:top-8')}
        >
          Login
        </Link>
        <div className="relative flex-col hidden h-full p-10 text-white bg-muted lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/logo.png" alt="Icon" className="w-6 h-6 mr-2" />
            You Bet
          </div>
        </div>
        <div className="flex items-center h-full p-4 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  )
}
