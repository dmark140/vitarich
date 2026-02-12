
"use client"

export const dynamic = 'force-dynamic'
import { useState } from "react" 
import ChickProcessForm from './ChickProcessForm'
import NavigationBar from "@/components/ui/sidebar/NavigationBar"

export default function Page() {
  const [open, setOpen] = useState(true)

  return (
    <NavigationBar
      currentLabel="Chick Pullout Process"
      fatherLink="./"
      fatherLabel="Hatchery"
    >
      <ChickProcessForm
        open={open}
        onClose={() => setOpen(false)}
      />
    </NavigationBar>
  )
}


