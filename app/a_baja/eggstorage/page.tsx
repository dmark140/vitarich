import NavigationBar from "@/components/ui/sidebar/NavigationBar"
import EggTable from "./egg-table"
export default function Page() {
  return (
    <div>
      <NavigationBar
        currentLabel="Egg Storage Management"
        fatherLink="/a_dean/hatchery"
        fatherLabel="Hatchery"
      >
        <EggTable />
      </NavigationBar>
    </div>
  )
}
