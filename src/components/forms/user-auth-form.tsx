import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
// import { signIn } from 'next-auth/react'
// import { useSearchParams } from 'next/navigation'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Icons } from '@/components/icons'
// import GoogleSignInButton from '../github-auth-button'

const signIn = (...args: unknown[]) => {
  location.href = '/'
}

function GoogleSignInButton() {
  const searchParams = new URLSearchParams(useLocation().search)
  const callbackUrl = searchParams.get('callbackUrl')

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() => signIn('github', { callbackUrl: callbackUrl ?? '/dashboard' })}
    >
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email..." disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="w-full ml-auto" type="submit">
            Continue With Email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  )
}
