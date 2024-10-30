import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getMyInfo, getRepos, getUserOrgs, importProjectForUser } from '@/service'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2, ChevronsUpDown } from 'lucide-react'
import { githubOAuthContentUri } from '@/lib/auth'
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ComboboxProps {
  options: Array<{ value: string; label: React.ReactNode }>
  placeholder?: string
  onSelect: (value: string) => void
  isLoading?: boolean
  customOptionLabel?: string
  onCustomOptionSelect?: () => void
  value?: string
}

export function Combobox({
  options,
  placeholder = 'Select...',
  onSelect,
  isLoading = false,
  customOptionLabel,
  onCustomOptionSelect,
  value,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const filteredOptions = options.filter((option) => option.value.toLowerCase().includes(searchValue.toLowerCase()))

  // 获取当前选中项的显示文本
  const selectedItem = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <span className="truncate">{selectedItem ? selectedItem.label : placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search..." value={searchValue} onValueChange={setSearchValue} />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onSelect(currentValue)
                      setOpen(false)
                      setSearchValue('')
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
                {filteredOptions.length === 0 && !isLoading && <CommandEmpty>No results found.</CommandEmpty>}
              </>
            )}
            {customOptionLabel && onCustomOptionSelect && (
              <CommandItem onSelect={onCustomOptionSelect}>{customOptionLabel}</CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const formSchema = z.object({
  org: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  project: z.string().min(2, {
    message: 'Repo must be at least 2 characters.',
  }),
})

export default function ImportProject() {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org: '',
      project: '',
    },
  })

  const { mutateAsync: importTutorial, isLoading: isImportTutorialLoading } = useMutation({
    mutationFn: importProjectForUser,
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getMyInfo,
  })
  const { data: userOrOrgOptions, isLoading: isUserOrOrgOptionsLoading } = useQuery({
    queryKey: ['userOrOrgOptions'],
    queryFn: async () => {
      const data = await getUserOrgs()
      return [{ login: profile?.username, avatar_url: profile?.avatarUrl, id: 'current_user' }, ...data]
    },
    enabled: !!open,
  })

  const { data: repos } = useQuery({
    queryKey: ['repos'],
    queryFn: () => getRepos(form.watch('org')),
    enabled: !!open && !!form.watch('org'),
  })

  const isConfirmButtonDisabled = isUserOrOrgOptionsLoading || form.formState.isSubmitting

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    form.reset()
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await importTutorial(values)
    handleOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Import Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
          <DialogDescription>Only support public repositories.</DialogDescription>
        </DialogHeader>
        {/* form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            {/* Select Github User Or Organization */}
            <FormField
              control={form.control}
              name="org"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github User Or Organization</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Github User Or Organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userOrOrgOptions?.map((item) => (
                        <SelectItem key={item.id} value={String(item.login)}>
                          <img
                            src={item.avatar_url}
                            alt={item.login}
                            className="mr-2 inline-block h-4 w-4 rounded-full"
                          />
                          <span>{item.login}</span>
                        </SelectItem>
                      ))}
                      <Button onClick={() => (window.location.href = githubOAuthContentUri())} className="mt-2 w-full">
                        <span>Add Another Organization</span>
                      </Button>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Select Repos */}
            {repos && (
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Repository</FormLabel>
                    <FormControl>
                      <Combobox
                        placeholder="Select repository..."
                        onSelect={field.onChange}
                        value={field.value}
                        options={repos
                          ?.filter((item) => item.owner.login === form.watch('org'))
                          .map((item) => ({
                            value: String(item.name),
                            label: item.name,
                            key: item.full_name,
                          }))}
                        isLoading={isUserOrOrgOptionsLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Button */}
            <div className="flex items-center justify-end gap-2">
              {/* Cancel */}
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isConfirmButtonDisabled}>
                Import{isImportTutorialLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
