import { db } from "@/lib/Supabase/supabaseClient"

export interface SavetaskPayload {
  id?: number | null
  project_id: number
  subject: string
  issue?: string
  priority: "low" | "mid" | "high"
  task_type: number
  parent_task?: number | null
  color?: string | null
}

export const savetask = async (
  payload: SavetaskPayload
) => {

  const { data, error } = await db.rpc("rpc_upsert_task", {
    p_id: payload.id ?? null,
    p_project_id: payload.project_id,
    p_subject: payload.subject,
    p_issue: payload.issue ?? null,
    p_priority: payload.priority,
    p_task_type: payload.task_type,
    p_parent_task: payload.parent_task ?? null,
    p_color: payload.color ?? null
  })

  if (error) throw error

  return data
}