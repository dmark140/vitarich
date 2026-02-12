"use client"

import SideBarMain from "@/components/ui/sidebar/SideBarMain"
import Eggstorageform from "./Eggstorageform"

export default function Page() {
  return (
    <SideBarMain
      currentLabel="Egg Storage - New"
      fatherLink="/a_baja/eggstorage"
      fatherLabel="Egg Storage"
    >
      <Eggstorageform />
    </SideBarMain>
  )
}