'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

type Props<T> = {
  list: T[]
  codeLabel: keyof T
  nameLabel?: keyof T
  value?: string
  placeholder?: string
  width?: number
  onChange: (value: string, item: T) => void
}

export default function SearchableDropdown<T extends Record<string, any>>({
  list,
  codeLabel,
  nameLabel,
  value,
  placeholder = 'Select...',
  width = 260,
  onChange,
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const displayText = (() => {
    const found = list.find(i => String(i[codeLabel]) === value)
    if (!found) return placeholder

    return nameLabel
      ? `${found[codeLabel]} — ${found[nameLabel]}`
      : String(found[codeLabel])
  })()

  const filtered = useMemo(() => {
    if (!search) return list

    const q = search.toLowerCase()

    return list.filter(item => {
      const code = String(item[codeLabel]).toLowerCase()
      const name = nameLabel
        ? String(item[nameLabel]).toLowerCase()
        : ''

      return code.includes(q) || name.includes(q)
    })
  }, [list, search, codeLabel, nameLabel])

  const selectItem = (item: T) => {
    onChange(String(item[codeLabel]), item)
    setOpen(false)
    setSearch('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && filtered.length > 0) {
      selectItem(filtered[0])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-full justify-start"
        >
          {displayText}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        style={{ width }}
      >
        <Command onKeyDown={handleKeyDown}>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup>
            {filtered.map((item, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => selectItem(item)}
              >
                {nameLabel
                  ? `${item[codeLabel]} — ${item[nameLabel]}`
                  : item[codeLabel]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
