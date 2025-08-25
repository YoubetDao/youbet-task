import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CirclePlus } from 'lucide-react'
import useQueryProjectsAndAssignees from '../_hooks/useQueryProjectsAndAssignees'
import { Controller, useForm } from 'react-hook-form'
import { priorities } from '../_constants'
import { useState } from 'react'
import { formatDateToDay } from '@/lib/utils'
import { TaskPriorityEnum } from '@/openapi/client'
import TaskCreateAssignees from './TaskCreateAssignees'
import TaskCreateProject from './TaskCreateProject'

export type TaskFormData = {
  title: string
  description: string
  due: Date
  priority: TaskPriorityEnum
  storyPoints: number
  project: { name: string; value: string }
  assignees: IAssignees[]
}

interface IAssignees {
  login: string
  avatarUrl: string
}

function TaskCreate() {
  const [open, setOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)

  const [projectsSearch, setProjectsSearch] = useState('')

  const { projects, assignees } = useQueryProjectsAndAssignees({ projectsSearch, searchAssigneesInProjects: '' })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      due: new Date(),
      priority: undefined,
      storyPoints: 1,
      project: { name: '', value: '' },
      assignees: [],
    },
  })

  const onDialogCloseChange = () => {
    if (!open) {
      reset()
    }
    setOpen(!open)
  }

  const onSubmit = async (data: TaskFormData) => {
    console.log('提交数据:', data)
    // 假装请求 API
    const res = await fetch('/api/form', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      alert('提交失败')
    } else {
      alert('提交成功！')
    }
  }
  return (
    <Dialog open={open} onOpenChange={onDialogCloseChange}>
      <form>
        <DialogTrigger asChild>
          <CirclePlus className="relative top-2 h-4 w-4 cursor-pointer" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Fill in the details to create a new task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title', { required: 'Title must be required.' })} placeholder="Title" />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Description" {...register('description')}></Textarea>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="due">Due</Label>
                <Controller
                  control={control}
                  name="due"
                  render={({ field }) => (
                    <Popover
                      open={dateOpen}
                      onOpenChange={() => {
                        setDateOpen(!dateOpen)
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="outline" id="date" className="w-54 justify-start px-3 font-normal">
                          {field.value ? formatDateToDay(field.value.toDateString()) : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(e) => {
                            field.onChange(e) // 更新 RHF 表单
                            setDateOpen(false) // 选完就关闭日历
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-54">
                        <SelectValue placeholder="Select priority" id="priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="sp">Story Points</Label>
                <Input type="number" placeholder="Story Points" {...register('storyPoints')} />
              </div>
              <TaskCreateProject
                control={control}
                projects={projects}
                projectsSearch={projectsSearch}
                setProjectsSearch={setProjectsSearch}
              />
            </div>
            <TaskCreateAssignees control={control} assignees={assignees} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={onDialogCloseChange}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit(onSubmit)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default TaskCreate
