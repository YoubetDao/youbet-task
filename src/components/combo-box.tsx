import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, ChevronsUpDown } from 'lucide-react'
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

  const filteredOptions = options.filter((option) =>
    option.label?.toString().toLowerCase().includes(searchValue.toLowerCase()),
  )

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
          <CommandInput
            placeholder="Search..."
            value={searchValue}
            onValueChange={(newValue) => {
              setSearchValue(newValue)
            }}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        onSelect(currentValue)
                        setOpen(false)
                        setSearchValue('') // Clear the search input after selection
                      }}
                    >
                      {option.label}
                    </CommandItem>
                  ))
                ) : (
                  <CommandEmpty>No results found.</CommandEmpty>
                )}
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
