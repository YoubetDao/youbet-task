import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export type TaskFormData = {
  title: string
  description: string
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title must be at least 1 characters.',
  }),
  description: z.string().optional(),
})

function TaskCreate() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  return (
    <>
      <CirclePlus className="relative top-2 h-4 w-4 cursor-pointer" onClick={() => setOpen(true)} />
      {open ? (
        <div className="h-20 w-full">
          <form
            onSubmit={handleSubmit((data) => {
              console.log('提交：', data)
              setOpen(false)
              reset()
            })}
          >
            <div className="relative z-10 float-right inline space-x-2">
              <Button type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-muted">
                Save
              </Button>
            </div>
            <Input
              {...register('title', { required: true })}
              type="text"
              placeholder={errors.title ? errors.title.message : 'Title'}
              className="relative -top-9 z-0 rounded-none border-none focus-visible:border-none focus-visible:ring-0"
            />
            <Input
              {...register('description')}
              type="text"
              placeholder="Description(optional)"
              className="relative -top-9 rounded-none border-none focus-visible:border-none focus-visible:ring-0"
            />
          </form>
        </div>
      ) : null}
    </>
  )
}
export default TaskCreate
