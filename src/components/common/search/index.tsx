import { z } from 'zod'
import { Input } from '../../ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '../../ui/form'
import { LucideSearch } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'

const sortValueToSortUrl = (sort: string) => {
  switch (sort) {
    case 'project':
      return 'name:asc,createdAt:desc'

    case 'contributors':
      return 'contributorsCount:desc,stargazersCount:desc,forksCount:desc,createdAt:desc,name:asc'

    case 'trending':
    default:
      return ''
  }
}

const sortUrlToSortValue = (sort: string) => {
  switch (sort) {
    case 'name:asc,createdAt:desc':
      return 'project'

    case 'contributorsCount:desc,stargazersCount:desc,forksCount:desc,createdAt:desc,name:asc':
      return 'contributors'

    case '':
    default:
      return 'trending'
  }
}

const formSchema = z.object({
  searchTerm: z.string().max(50),
  sortTerm: z.enum(['trending', 'project', 'contributors']),
})

interface SearchInputProps {
  placeholder: string
  searchInitialValue: string
  sortInitialValue: string
  handleSubmit: (searchValue: string, sortValue: string) => void
}

export const SearchInput = ({ searchInitialValue, sortInitialValue, placeholder, handleSubmit }: SearchInputProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchTerm: searchInitialValue,
      sortTerm: sortUrlToSortValue(sortInitialValue),
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSubmit(values.searchTerm.trim().replace(/\s+/g, ','), sortValueToSortUrl(values.sortTerm) as string)
  }

  return (
    <Form {...form}>
      <form className="flex w-full flex-row gap-4">
        <div className="relative flex-1">
          <LucideSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
          <FormField
            control={form.control}
            name="searchTerm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        form.handleSubmit(onSubmit)()
                      }
                    }}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent pl-8"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="sortTerm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.handleSubmit(onSubmit)()
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="gap-2">
                      <span>Sort by </span>
                      <span className="lowercase text-primary">
                        <SelectValue />
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending projects</SelectItem>
                      <SelectItem value="project">Project name</SelectItem>
                      <SelectItem value="contributors">Number of contributors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
