import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ProjectControllerGetProjectInvolvedAssignees200Response } from '@/openapi/client'
import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { TaskFormData } from './TaskCreate'

function TaskCreateAssignees({
  control,
  assignees,
}: {
  control: Control<TaskFormData>
  assignees: ProjectControllerGetProjectInvolvedAssignees200Response | undefined
}) {
  const [assignsOpen, setAssignsOpen] = useState(false)
  const onSelectAssigneesChange = (
    field: {
      onChange: any
      value: any
    },
    selected: string,
  ) => {
    const fd = (assignees?.data || []).find((assign) => assign.login === selected)
    if (field.value.find((x: { login: string }) => x.login === selected)) {
      field.onChange(field.value.filter((x: { login: string }) => x.login !== selected))
    } else {
      field.onChange([...field.value, { login: selected, avatarUrl: fd?.avatarUrl }])
    }
  }
  return (
    <div className="grid gap-3">
      <Label htmlFor="assignees">Assignees</Label>
      <Controller
        name="assignees"
        control={control}
        render={({ field }) => (
          <Popover open={assignsOpen} onOpenChange={setAssignsOpen}>
            <PopoverTrigger asChild>
              <Button
                id="assignees"
                variant="outline"
                role="combobox"
                aria-expanded={assignsOpen}
                className="justify-start px-3"
              >
                {field.value.length ? (
                  <div className="flex -space-x-3">
                    {field.value.map((assign) => (
                      <img
                        key={assign.login}
                        className="h-6 w-6 rounded-full border-2 border-white"
                        src={assign.avatarUrl}
                        alt={assign.login}
                      />
                    ))}
                  </div>
                ) : (
                  'Select Assignees'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Command>
                <CommandInput placeholder="Search assignees..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No assignees found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      {assignees?.data?.map((item) => {
                        return (
                          <CommandItem
                            key={item.login}
                            value={item.login}
                            onSelect={(select) => onSelectAssigneesChange(field, select)}
                          >
                            <Checkbox value={item.login} checked={field.value.some((x) => x.login === item.login)} />
                            <label className="flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              <img
                                key={item.login}
                                className="mr-2 h-6 w-6 rounded-full border-2 border-white"
                                src={item.avatarUrl}
                                alt={item.login}
                              />
                              <div className="pt-1">{item.login}</div>
                            </label>
                          </CommandItem>
                        )
                      })}
                    </CommandList>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}

export default TaskCreateAssignees
