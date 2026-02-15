import NavigationBar from "@/components/ui/sidebar/NavigationBar"
import EggHatchTable from "./egghatch-table"

export default function Page() {
  return (
    <NavigationBar
      currentLabel="Egg Hatchery Process List"
      fatherLabel="Hatchery"
      fatherLink="/a_dean/hatchery"
    >
      <EggHatchTable />
    </NavigationBar>
  )
}
