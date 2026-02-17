'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { db } from '@/lib/Supabase/supabaseClient'

type Breeder = {
    brdr_ref_no: string | null
}

type Props = {
    value?: string
    setValue?: (value: string) => void
    label?: string
    placeholder?: string
}

export default function BreederRef({
    value,
    setValue,
    label = 'Breeder Ref. No.',
    placeholder = 'Select Breeder Ref No',
}: Props) {
    const [breeders, setBreeders] = useState<Breeder[]>([])
    const [internalValue, setInternalValue] = useState('')
    const [open, setOpen] = useState(false)

    //   useEffect(() => {
    //     const load = async () => {
    //       const { data, error } = await db
    //         .from('viewforhatcheryclassi')
    //         .select('brdr_ref_no', { distinct: true })
    //         .not('brdr_ref_no', 'is', null)
    //         .order('brdr_ref_no', { ascending: true })

    //       if (!error && data) setBreeders(data as Breeder[])
    //     }
    //     load()
    //   }, [])

    useEffect(() => {
        const load = async () => {
            const { data, error } = await db
                .from('viewforhatcheryclassi')
                .select('brdr_ref_no')
                .not('brdr_ref_no', 'is', null)

            if (!error && data) {
                const unique = Array.from(
                    new Map(data.map(b => [b.brdr_ref_no, b])).values()
                ).sort((a, b) =>
                    (a.brdr_ref_no ?? '').localeCompare(b.brdr_ref_no ?? '')
                )

                setBreeders(unique as Breeder[])
            }
        }

        load()
    }, [])


    const selected = value ?? internalValue

    const handleChange = (v: string) => {
        if (setValue) setValue(v)
        else setInternalValue(v)
        setOpen(false)
    }

    return (
        <div className="space-y-2">
            <Label>{label}</Label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selected || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search breeder ref..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {breeders.map((b, i) => {
                                    const ref = b.brdr_ref_no ?? ''
                                    return (
                                        <CommandItem
                                            key={i}
                                            value={ref}
                                            onSelect={() => handleChange(ref)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    selected === ref ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {ref}
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
