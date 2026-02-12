// app/a_dean/storage/api.ts

import { db } from "@/lib/Supabase/supabaseClient"
import { StorageLocationData } from "@/lib/types"

export async function getStorageLocations(
  warehouseId: number,
  id?: number
) {
  try {
    const query = db
      .from('i_storage_location')
      .select('*')
      .eq('warehouse_id', warehouseId)
      .eq('void', false)
      .order('level_no', { ascending: true })

    if (id) {
      const { data, error } = await query
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        success: true,
        data: data as StorageLocationData
      }
    }

    const { data, error } = await query

    if (error) throw error

    return {
      success: true,
      data: data as StorageLocationData[]
    }

  } catch (error: any) {
    console.error('Error fetching storage locations:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function voidStorageLocation(id: number) {
  try {
    const { error } = await db
      .from('i_storage_location')
      .update({ void: true })
      .eq('id', id)

    if (error) throw error

    return { success: true }

  } catch (error: any) {
    console.error('Error voiding location:', error.message)
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
      .from('i_storage_location')
      .insert(payload)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }

  } catch (error: any) {
    console.error('Error creating location:', error.message)
    return { success: false, error: error.message }
  }
}



// add this when void is okay

// const { data: children } = await db
//   .from('i_storage_location')
//   .select('id')
//   .eq('parent_id', id)
//   .eq('void', false)

// if (children && children.length > 0) {
//   throw new Error('Cannot void location with active child nodes')
// }
