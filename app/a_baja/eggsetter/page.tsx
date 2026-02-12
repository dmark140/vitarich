import NavigationBar from "@/components/ui/sidebar/NavigationBar"
import EggsetterTable from "./eggsetter-table"

export default function Page() {
  return (
    <NavigationBar currentLabel="Egg Setter" fatherLink="/a_dean/hatchery" fatherLabel="Hatchery">
      <EggsetterTable />
    </NavigationBar>
  )
}
