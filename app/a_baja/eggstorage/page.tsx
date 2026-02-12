import SideBarMain from "@/components/ui/sidebar/SideBarMain"
import EggTable from "./egg-table"
export default function Page() {
  return (
    <div>
      <SideBarMain
        currentLabel="Egg Storage Management"
        fatherLink="/a_dean/hatchery"
        fatherLabel="Hatchery"
      >
        <EggTable />
      </SideBarMain>
    </div>
  )
}
