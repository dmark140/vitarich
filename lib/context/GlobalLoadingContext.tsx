"use client"

import React, { createContext, useContext, useState } from "react"

type GlobalLoadingContextType = {
  loading_g: boolean
  setLoading: (value: boolean) => void
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | null>(null)

export function GlobalLoadingProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading_g, setLoading] = useState(false)

  return (
    <GlobalLoadingContext.Provider
      value={{
        loading_g,
        setLoading,
      }}
    >
      {children}
    </GlobalLoadingContext.Provider>
  )
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext)

  if (!context) {
    throw new Error("useGlobalLoading must be used inside GlobalLoadingProvider")
  }

  return context
}