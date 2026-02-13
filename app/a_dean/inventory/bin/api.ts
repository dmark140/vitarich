// app/a_dean/warehouse/tree-api.ts

import { db } from "@/lib/Supabase/supabaseClient"

export async function getWarehouseTree() {
  try {
    const { data, error } = await db
      .from("vw_warehouse_tree")
      .select("*")

    if (error) throw error

    return { success: true, data }
  } catch (error: any) {
    console.error("Error fetching tree:", error.message)
    return { success: false, error: error.message }
  }
}
