"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type SidebarContextType = {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed")
    if (stored !== null) setCollapsed(stored === "true")
    setHydrated(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem("sidebar-collapsed", String(collapsed))
  }, [collapsed, hydrated])

  // SSR-safe placeholder (prevents hydration mismatch)
  if (!hydrated) {
    return <div className="border-r bg-background w-64" />
  }

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle: () => setCollapsed((v) => !v) }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.")
  return context
}
