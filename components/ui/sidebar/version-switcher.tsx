"use client"

import * as React from "react"
import { Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

export function VersionSwitcher({
  versions,
  defaultVersion,
}: {
  versions: string[]
  defaultVersion: string
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <div className="flex items-baseline gap-2 mx-2">
            <a href="#" className="flex items-center gap-2 font-medium my-4">
              {/* <div className="  text-primary-foreground flex size-6 items-center justify-center rounded-md"> */}
                <Image
                  src="https://cdn.prod.website-files.com/6819a7964b427b4964f82cc0/68203089539798c6cc2ba1c0_Corporate-Logo_Vitarich-White.png"
                  alt="Vitarich Logo"
                  width={55}
                  height={55}
                  className=""
                />  
                 {/* </div> */}
              Vitarich Corp
            </a>
            <div className="flex flex-col gap-0.5 leading-none">
            </div>
          </div>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                v{version}{" "}
                {version === selectedVersion && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
