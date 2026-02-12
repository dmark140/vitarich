"use client"
import { useState } from "react" 
import EggTransferForm from "./EggTransferForm"
import NavigationBar from "@/components/ui/sidebar/NavigationBar"

export default function Page() {
  const [open, setOpen] = useState(true)

  return (
    <NavigationBar
      currentLabel="Egg Transfer Process"
      fatherLink="./"
      fatherLabel="Hatchery"
    >
      <EggTransferForm
        open={open}
        onClose={() => setOpen(false)}
      />
    </NavigationBar>
  )
}
