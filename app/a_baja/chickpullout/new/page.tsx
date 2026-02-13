
import NavigationBar from "@/components/ui/sidebar/NavigationBar"
import CheckPulloutForm from "./CheckPulloutForm"

export default function Page() {
  return (
    <NavigationBar
      currentLabel="Add Chick Pullout"
      fatherLink="/a_baja/chickpullout"
      fatherLabel="Hatchery"
    >
      <CheckPulloutForm />
    </NavigationBar>
  )
}
