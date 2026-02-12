 import SideBarMain from "@/components/ui/sidebar/SideBarMain"
import Prewarmingform from "./Prewarmingform"

export default function Page() {
  return (
    <SideBarMain 
    currentLabel="Egg Pre-Warming" 
    fatherLink="/a_dean/hatchery" 
    fatherLabel="Hatchery">
      <Prewarmingform />
    </SideBarMain>
  )
}
