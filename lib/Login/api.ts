import { db } from "@/lib/Supabase/supabaseClient"
import { ApprovalRequestCreate, ApprovalRequest } from "@/lib/types/approval"

const TABLE = "approval_requests"

export async function createApprovalRequest(
  payload: ApprovalRequestCreate
) {
  const { data, error } = await db
    .from(TABLE)
    .insert([payload])
    .select("*")
    .single()

  if (error) throw error

  return data as ApprovalRequest
}