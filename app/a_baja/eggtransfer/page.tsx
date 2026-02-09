"use client"
import { useState } from "react" 
import SideBarMain from '@/components/ui/sidebar/SideBarMain' 
import EggTransferForm from "./EggTransferForm"

export default function Page() {
  const [open, setOpen] = useState(true)

  return (
    <SideBarMain
      currentLabel="Egg Transfer Process"
      fatherLink="./"
      fatherLabel="Hatchery"
    >
      <EggTransferForm
        open={open}
        onClose={() => setOpen(false)}
      />
    </SideBarMain>
  )
}
