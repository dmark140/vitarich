import SideBarMain from "@/components/ui/sidebar/SideBarMain"
import HatchTable from "./hatch-table"

export default function Page() {
  return (
    <div>
      <SideBarMain
        currentLabel="Hatchery Classification"
        fatherLink="./"
        fatherLabel="Hatchery"
      >
        <HatchTable />
      </SideBarMain>
    </div>
  )
}
