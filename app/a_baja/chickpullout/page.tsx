import ChickPulloutTable from "./chickpullout-table"
import NavigationBar from "@/components/ui/sidebar/NavigationBar"

export default function Page() {
  return (
    <NavigationBar
      currentLabel="Chick Pullout"
      fatherLink="/a_dean/hatchery"
      fatherLabel="Hatchery"
    >
      <ChickPulloutTable />
    </NavigationBar>
  )
}


