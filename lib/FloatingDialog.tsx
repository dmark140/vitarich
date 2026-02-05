"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type FloatingDialogContextType = {
  openDialog: (content: React.ReactNode) => void
  closeDialog: () => void
}

const FloatingDialogContext = React.createContext<FloatingDialogContextType | null>(null)

export function FloatingDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [content, setContent] = React.useState<React.ReactNode>(null)

  const openDialog = React.useCallback((c: React.ReactNode) => {
    setContent(c)
    setIsOpen(true)
  }, [])

  const closeDialog = React.useCallback(() => {
    setIsOpen(false)
    setContent(null)
  }, [])

  return (
    <FloatingDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <DialogContent className="max-w-lg">
          {content}
        </DialogContent>
      </Dialog>
    </FloatingDialogContext.Provider>
  )
}

export function useFloatingDialog() {
  const ctx = React.useContext(FloatingDialogContext)
  if (!ctx) {
    throw new Error("useFloatingDialog must be used within FloatingDialogProvider")
  }
  return ctx
}
