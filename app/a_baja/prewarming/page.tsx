"use client"
import { useState } from "react" 
import SideBarMain from '@/components/ui/sidebar/SideBarMain'  
import EggPreWarmingLayout from "./prewarm"

// export default function page() {
//     return (
//         <div>
//             <SideBarMain currentLabel='Chick Pullout Process ' fatherLink='./' fatherLabel='Hatchery'>
//                 <ChickProcessForm open={false} onClose={function (): void {
//                     throw new Error('Function not implemented.')
//                 } } />
//             </SideBarMain>

//         </div>
//     )
// }


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
