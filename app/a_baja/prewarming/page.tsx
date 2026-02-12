"use client"
import { useState } from "react" 
import NavigationBar from '@/components/ui/sidebar/NavigationBar' 
import EggPreWarmingLayout from './EggPreWarmingLayout'
export default function Page() {
  const [open, setOpen] = useState(true)

  return (
    <NavigationBar
      currentLabel="Egg Pre-Warming Process"
      fatherLink="./"
      fatherLabel="Hatchery"
    >
      <EggPreWarmingLayout
        open={open}
        onClose={() => setOpen(false)}
      />
    </NavigationBar>
  )
}
