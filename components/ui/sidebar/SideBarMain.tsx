'use client'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { ReactNode } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"
import { Button } from "../button"
import { Sun } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../dropdown-menu"
// import GlobalDefaults from "@/lib/GlobalDefaults"
import { useTheme } from "next-themes"
import GlobalSearch from "../GlobalSearch"
import GlobalDefaults from "@/lib/Defaults/GlobalDefaults"
// import DefaultBranch from "@/components/DefaultBranch"

type SideBarMainProps = {
    children: ReactNode
    fatherLabel?: string
    fatherLink?: string
    currentLabel: string
}

export default function SideBarMain({
    children,
    fatherLabel = "",
    fatherLink = "#",
    currentLabel,
}: SideBarMainProps) {
    const { setTheme, theme } = useTheme()
    return (
        <SidebarProvider >
            <SidebarInset>
                <header className="flex h-12 items-center gap-2 px-4">
                    <div className="w-10 sm:w-0"></div>
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb className="flex justify-center" >
                        <BreadcrumbList >
                            {fatherLabel && (
                                <>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href={fatherLink}>
                                            {fatherLabel}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden mt-1 md:block" />
                                </>
                            )}

                            <BreadcrumbItem>
                                <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="float-right ml-auto flex gap-4 items-center">
                        <GlobalSearch />
                        {/* <DefaultBranch /> */}
                        <GlobalDefaults />
                        <Button onClick={() => theme == "light" ? setTheme("dark") : setTheme("light")}>
                            <Sun />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className="cursor-pointer" >
                                    <AvatarImage src="htxtps://avatars.githubusercontent.com/u/14121234?v=4&size=64" />
                                    <AvatarFallback>VI</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <Separator className="border border-secondary" />
                                <DropdownMenuItem ><a href="/logout">Logout</a></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <div className="overflow-auto border-t">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
