import { db } from "@/lib/Supabase/supabaseClient"

export const getProjectById = async (id: number) => {
  const { data, error } = await db
    .from("vw_projects_full")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error(error)
    throw error
  }

  return data
}