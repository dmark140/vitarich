'use client'
import { Button } from "@/components/ui/button";

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Search, FileText, Package, LayoutGrid } from "lucide-react"
import { filterNavFolders } from '@/lib/sidebar/AppSidebar'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { NavFolders } from '@/lib/Defaults/DefaultValues'

interface collapsed {
    collapsed: boolean
}

export default function GlobalSearch({ collapsed }: collapsed) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { getValue } = useGlobalContext()

    const filteredFolders = filterNavFolders(NavFolders, getValue("UserPermission") || [])

    // Keyboard shortcut (CMD+K or CTRL+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <>
            {/* <button
                onClick={() => setOpen(true)}
                className="relative inline-flex items-center w-full px-4 py-2 text-sm text-muted-foreground bg-secondary/50 border rounded-md hover:bg-secondary transition-colors"
            >
                <Search className="w-4 h-4 mr-2" />
                <div className='w-30 text-left'>Search...</div>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button> */}

            <Button
                variant="secondary" // Changed to secondary to match your bg-secondary/50 look
                type="button"
                onClick={() => setOpen(true)}
                // disabled={loading}
                className={`relative h-9 w-56 justify-start gap-2 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary ${collapsed ? "justify-center" : ""
                    }`}
            >
                <Search className="h-4 w-4" />

                {!collapsed && (
                    <>
                        <span className="flex-1 text-left">Search...</span>
                        <kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </>
                )}
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search modules or reports..." />
                <CommandList className="max-h-100">
                    <CommandEmpty>No results found.</CommandEmpty>

                    {filteredFolders.map((folder) => (
                        <React.Fragment key={folder.id}>
                            <CommandGroup heading={folder.title}>
                                {folder.items.map((group: any) => (
                                    group.children.map((child: any) => (
                                        <CommandItem
                                            key={child.url + child.title}
                                            value={`${folder.title} ${child.title} ${group.group}`} // Helps search accuracy
                                            onSelect={() => {
                                                if (child.url !== "#") {
                                                    runCommand(() => router.push(child.url))
                                                }
                                            }}
                                        >
                                            {child.type === "Module" ? (
                                                <Package className="mr-2 h-4 w-4 text-blue-500" />
                                            ) : (
                                                <FileText className="mr-2 h-4 w-4 text-orange-500" />
                                            )}
                                            <div className="flex flex-col">
                                                <span>{child.title}</span>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {folder.title} › {group.group}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                        </React.Fragment>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    )
}