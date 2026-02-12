import SideBarMain from "@/components/ui/sidebar/SideBarMain"
import EggsetterTable from "./eggsetter-table"

export default function Page() {
  return (
    <SideBarMain currentLabel="Egg Setter" fatherLink="/a_dean/hatchery" fatherLabel="Hatchery">
      <EggsetterTable />
    </SideBarMain>
  )
}
