import NavigationBar from "@/components/ui/sidebar/NavigationBar";
import PlacementForm from "./PlacementForm";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <NavigationBar
      currentLabel="New Placement"
      fatherLink="/jmb/placement"
      fatherLabel="Placement"
    >
      <PlacementForm />
    </NavigationBar>
  );
}
