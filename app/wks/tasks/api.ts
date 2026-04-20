import { db } from "@/lib/Supabase/supabaseClient"

export const getTask = async () => {
  const { data, error } = await db
    .from("vw_projects_list")
    .select("*")

  if (error) {
    console.error(error)
    throw error
  }

  return data ?? []
}