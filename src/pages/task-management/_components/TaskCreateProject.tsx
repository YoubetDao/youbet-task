import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Control, Controller } from 'react-hook-form'
import { TaskFormData } from './TaskCreate'
import { ProjectControllerGetProjects200Response } from '@/openapi/client'
import { useState } from 'react'

export default function TaskCreateProject({
  control,
  projects,
  projectsSearch,
  setProjectsSearch,
}: {
  control: Control<TaskFormData>
  projects: ProjectControllerGetProjects200Response | undefined
  projectsSearch: string
  setProjectsSearch: React.Dispatch<React.SetStateAction<string>>
}) {
  const [projectOpen, setProjectOpen] = useState(false)
  return (
    <div className="grid gap-2">
      <Label htmlFor="project">Project</Label>
      <Controller
        control={control}
        name="project"
        render={({ field }) => (
          <Popover open={projectOpen} onOpenChange={setProjectOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={projectOpen}
                className="justify-start px-3"
                id="project"
              >
                {field.value?.name ? field.value?.name : 'Select a project'}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Command>
                <CommandInput
                  placeholder="Search project..."
                  className="h-9"
                  value={projectsSearch}
                  onValueChange={(val) => setProjectsSearch(val)}
                />
                <CommandGroup>
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {(projects?.data || []).map((p) => {
                      return (
                        <CommandItem
                          key={p._id}
                          value={p.name}
                          onSelect={(val) => {
                            const fd = projects?.data?.find((i) => i.name + '' === val)
                            if (fd) {
                              field.onChange({ name: val, value: fd._id })
                            }
                            setProjectOpen(false)
                          }}
                        >
                          {p.name}
                        </CommandItem>
                      )
                    })}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  )
}
