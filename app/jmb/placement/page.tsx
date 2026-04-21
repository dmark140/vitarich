export const dynamic = "force-dynamic";

import NavigationBar from "@/components/ui/sidebar/NavigationBar";
import PlacementTable from "./placement-table";

export default function Page() {
  return (
    <NavigationBar currentLabel="">
      <PlacementTable />
    </NavigationBar>
  );
}
