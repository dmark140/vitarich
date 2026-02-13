// app/a_dean/storage/api.ts

import { db } from "@/lib/Supabase/supabaseClient"
import { StorageLocationData } from "@/lib/types"



export async function getStorageLocations(
  warehouseId: number
) {
  try {
    const { data, error } = await db
      .from("i_storage_location")
      .select("*")
      .eq("warehouse_id", warehouseId)
      .eq("void", false)
      .order("level_no", { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data as StorageLocationData[]
    }

  } catch (error: any) {
    console.error("Error fetching storage:", error.message)
    return { success: false, error: error.message }
  }
}

export async function createStorageLocation(payload: {
  warehouse_id: number
  parent_id: number | null
  location_code: string
  location_name?: string
}) {
  try {
    const { data, error } = await db
      .from("i_storage_location")
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }

  } catch (error: any) {
    console.error("Error creating storage:", error.message)
    return { success: false, error: error.message }
  }
}



export async function generateStorageStructure(payload: {
  warehouse_id: number
  room_start: number
  room_end: number
  rack_start: number
  rack_end: number
  bin_start: number
  bin_end: number
  subbin_start: number
  subbin_end: number
}) {
  try {
    const { error } = await db.rpc("fn_generate_storage_structure", {
      p_warehouse_id: payload.warehouse_id,
      p_room_start: payload.room_start,
      p_room_end: payload.room_end,
      p_rack_start: payload.rack_start,
      p_rack_end: payload.rack_end,
      p_bin_start: payload.bin_start,
      p_bin_end: payload.bin_end,
      p_subbin_start: payload.subbin_start,
      p_subbin_end: payload.subbin_end
    })

    if (error) throw error

    return { success: true }

  } catch (error: any) {
    console.error("Error generating structure:", error.message)
    return { success: false, error: error.message }
  }
}
