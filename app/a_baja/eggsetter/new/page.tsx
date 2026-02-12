import SideBarMain from "@/components/ui/sidebar/SideBarMain" 
import EggsetterForm from "./Eggsetterform" 

export default function Page() {
  return (
    <div>
      <SideBarMain
        currentLabel="New Egg Setting"
        fatherLink="/a_baja/eggsetter"
        fatherLabel="Egg Setter"
      >
        <EggsetterForm />
      </SideBarMain>
    </div>
  )
}