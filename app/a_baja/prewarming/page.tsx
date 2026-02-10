"use client"
import { useState } from "react" 
import SideBarMain from '@/components/ui/sidebar/SideBarMain' 
import EggPreWarmingLayout from './EggPreWarmingLayout'
export default function Page() {
  const [open, setOpen] = useState(true)

  return (
    <SideBarMain
      currentLabel="Egg Pre-Warming Process"
      fatherLink="./"
      fatherLabel="Hatchery"
    >
      <EggPreWarmingLayout
        open={open}
        onClose={() => setOpen(false)}
      />
    </SideBarMain>
  )
}
