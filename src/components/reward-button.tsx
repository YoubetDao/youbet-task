import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CirclePlus } from 'lucide-react'
import { Separator } from './ui/separator'
import { PeriodControllerGetPeriodsRewardGrantedEnum } from '@/openapi/client'
import { Checkbox } from './ui/checkbox'

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
interface IRewardButtonProps {
  selected: string
  pageId: string
  rewardState: string
  setRewardState: (update: string | ((prev: string) => string)) => void
}

const statuses = (
  Object.keys(PeriodControllerGetPeriodsRewardGrantedEnum) as Array<
    keyof typeof PeriodControllerGetPeriodsRewardGrantedEnum
  >
).map((key) => ({
  label: key,
  value: PeriodControllerGetPeriodsRewardGrantedEnum[key],
}))

const valueToLabel = Object.entries(PeriodControllerGetPeriodsRewardGrantedEnum).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

export function RewardButton(props: IRewardButtonProps) {
  const [open, setOpen] = React.useState(false)
  const { rewardState, setRewardState } = props

  const changeValue = (value: string) => {
    setRewardState(value)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-max-[300px] justify-start space-x-4 ">
          <CirclePlus className="h-[12px]" /> Reward
          {rewardState.length > 0 ? (
            <>
              <Separator orientation="vertical" />
              <div key={rewardState} className="rounded-lg border-2 border-solid border-muted bg-muted px-2">
                {valueToLabel[rewardState]}
              </div>
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
                  key={status.value.toString()}
                  value={status.value.toString()}
                  onSelect={(value) => {
                    changeValue(value)
                    setOpen(false)
                  }}
                >
                  <Checkbox
                    checked={rewardState === status.value.toString()}
                    id={status.value.toString()}
                    value={status.value.toString()}
                    onChange={(e: React.FormEvent<HTMLButtonElement>) => {
                      const value = (e.target as HTMLInputElement).value
                      changeValue(value)
                    }}
                  />
                  <label
                    htmlFor={status.value.toString()}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.label.toString()}
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
