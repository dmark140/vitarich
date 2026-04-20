// app/wks/projects/new/api.ts

import { db } from "@/lib/Supabase/supabaseClient"
import { format } from "date-fns"

export interface SaveProjectPayload {
  id?: number | null
  project_name: string
  description?: string
  start_date: Date
  end_date: Date
  project_manager?: number | null
  project_type: string
  project_members?: number[]
}

export const saveProject = async (
  formValues: SaveProjectPayload
) => {
  const { data, error } = await db.rpc("rpc_upsert_project", {
    p_id: formValues.id ?? null,
    p_project_name: formValues.project_name,
    p_description: formValues.description ?? null,
    p_start_date: format(formValues.start_date, "yyyy-MM-dd"),
    p_end_date: format(formValues.end_date, "yyyy-MM-dd"),
    p_project_manager: formValues.project_manager ?? null,
    p_project_type: formValues.project_type,
    p_members: formValues.project_members ?? []
  })

  if (error) {
    console.error("RPC ERROR:", error)
    throw error
  }

  return data
}