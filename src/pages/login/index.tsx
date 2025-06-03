import { Link, useNavigate } from 'react-router-dom'
import UserAuthForm from '@/components/forms/user-auth-form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { BRAND_LOGO, BRAND_NAME } from '@/lib/config'
import { getSafeHrefByTitle } from '@/constants/data'
import { useToken } from '@/store'

export default function Login() {
  const navigate = useNavigate()
  const [token] = useToken()

  useEffect(() => {
    if (token) {
      navigate(getSafeHrefByTitle('Dashboard'), { replace: true })
    }
  }, [token, navigate])

  return (
    <>
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/examples/authentication"
          className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 hidden md:right-8 md:top-8')}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src={BRAND_LOGO} alt="Icon" className="mr-2 h-6 w-6" />
            {BRAND_NAME}
          </div>
        </div>
        <div className="flex h-full items-center p-4 lg:p-8">
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
