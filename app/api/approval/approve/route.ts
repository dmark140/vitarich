import { admin_db } from "@/lib/Supabase/supabaseAdmin"
import { db } from "@/lib/Supabase/supabaseClient"
import { decryptValue } from "@/lib/decrypt"

export async function POST(req: Request) {
  const { requestId, approvedBy } = await req.json()

  const { data: request, error } = await db
    .from("approval_requests")
    .select("*")
    .eq("id", requestId)
    .single()

  if (error) throw error
  if (!request) throw new Error("Request not found")

  const password = decryptValue(request.value_encrypted)

  const { data: userRow, error: userError } = await db
    .from("users")
    .select("auth_id")
    .eq("email", request.user_email)
    .single()

  if (userError) throw userError
  if (!userRow) throw new Error("User not found")

  const authId = userRow.auth_id

  await admin_db.auth.admin.updateUserById(authId, {
    password
  })

  const { error: updateError } = await db
    .from("approval_requests")
    .update({
      status: "approved",
      approved_by: approvedBy,
      approved_at: new Date()
    })
    .eq("id", requestId)

  if (updateError) throw updateError

  return Response.json({ success: true })
}