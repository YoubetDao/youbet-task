'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CirclePlus } from 'lucide-react'
import { Checkbox } from './ui/checkbox'
import { RewardState } from '@/store'
import { Period, Task } from '@/types'
import { Separator } from './ui/separator'

interface IRewardButtonProps {
  selected: string[]
  data: Task[] | Period[]
  pageId: string
  rewardState: string[]
  setRewardState: (update: string[] | ((prev: string[]) => string[])) => void
}

const statuses = (Object.keys(RewardState) as Array<keyof typeof RewardState>)
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key,
    value: key,
  }))

const valueToLabel = Object.entries(RewardState).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

export function RewardButton(data: IRewardButtonProps) {
  const [open, setOpen] = React.useState(false)
  const { rewardState, setRewardState } = data

  const changeValue = (value: string) => {
    let newState = JSON.parse(JSON.stringify(rewardState))
    if (rewardState.includes(value)) {
      newState = newState.filter((x: string) => x != value)
    } else {
      newState.push(value)
    }
    setRewardState(newState)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-max-[300px] h-[40px] justify-start space-x-4 ">
          <CirclePlus className="h-[12px]" /> Reward
          {rewardState.length > 0 ? (
            <>
              <Separator orientation="vertical" />
              {rewardState.map((rs) => (
                <div key={rs} className="rounded-lg border-2 border-solid border-muted bg-muted px-2">
                  {valueToLabel[rs]}
                </div>
              ))}
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
        <Command>
          <CommandInput placeholder="Reward" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(value) => {
                    changeValue(valueToLabel[value])
                    setOpen(false)
                  }}
                >
                  <Checkbox
                    checked={rewardState.includes(valueToLabel[status.value])}
                    id={status.value}
                    value={status.value}
                    onChange={(e) => {
                      const value = (e.target as HTMLButtonElement).value
                      changeValue(valueToLabel[value])
                    }}
                  />
                  <label
                    htmlFor={status.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.label}
                  </label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
