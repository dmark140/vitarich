'use client'
import React, { useEffect } from 'react'
import Link from 'next/link' // 
import { useRouter } from 'next/navigation' // [cite: 2]
import { ExternalLink } from 'lucide-react'
import { NavFolders } from '@/lib/Defaults/DefaultValues' // [cite: 1]
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { filterNavFolders } from '@/lib/sidebar/AppSidebar'

interface ChildFolderProps {
  id: number;
}

export default function ChildFolder({ id }: ChildFolderProps) {
  const router = useRouter()
  const { getValue } = useGlobalContext() // [cite: 2]

  const filteredNavFolders = filterNavFolders(
    NavFolders,
    getValue("UserPermission") || []
  )

  const filteredData = filteredNavFolders.find(f => f.id === id || f.title === "Hatchery")

  useEffect(() => {
    if (!filteredData) return

    filteredData.items?.forEach((group: any) => {
      group.children?.forEach((child: any) => {
        if (child.url && child.url !== "#") {
          router.prefetch(child.url)
        }
      })
    })
  }, [router, filteredData])

  if (!filteredData) return <div className="p-4">No permissions for this section.</div>

  return (
    <div className="grid gap-8 grid-cols-1 mx-4">
      <div className='mt-4'>
        <div className="font-bold text-lg mb-2">Masters and Reports</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredData.items.map((group: any, i: number) => (
            <div key={i} className="w-full">
              <div className="mt-4 font-bold border-b pb-1 mb-2">
                {group.group}
              </div>
              <div className="grid gap-2">
                {group.children.map((child: any, ii: number) => (
                  <div className="flex gap-2 items-center group" key={ii}>
                    {/* Use Link to prevent page flicker [cite: 13, 14] */}
                    <Link
                      href={child.url}
                      className=" hover:underline transition-colors"
                    >
                      {child.title}
                    </Link>

                    {child.url !== "#" && (
                      <a
                        href={child.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="size-3 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}