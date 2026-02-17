export const dynamic = 'force-dynamic'


import NavigationBar from "@/components/ui/sidebar/NavigationBar"
import PrewarmTable from "./prewarm-table"

export default function Page() {
  return (
    <NavigationBar
      currentLabel=""
    >
      <PrewarmTable />
    </NavigationBar>
  )
}


