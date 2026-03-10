import { db } from "@/lib/Supabase/supabaseClient"
import { ApprovalRequest, ApprovalRequestCreate } from "../types"

const TABLE = "approval_requests"

export async function createApprovalRequest(
  payload: ApprovalRequestCreate
) {
  const { error } = await db
    .from(TABLE)
    .insert([payload])

  if (error) throw error
}