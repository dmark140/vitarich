import NavigationBar from "@/components/ui/sidebar/NavigationBar";
import EggHatchform from "./EggHatchform";

export default function Page() {
  return (
    <NavigationBar
      currentLabel="Add Egg Hatcher"
      fatherLabel="Egg Hatcher Process"
      fatherLink="/jmb/egghatcherv2"
    >
      <EggHatchform />
    </NavigationBar>
  );
}
