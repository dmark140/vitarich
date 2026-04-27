import { db } from "@/lib/Supabase/supabaseClient"

export const getProjects = async () => {
  const { data, error } = await db
    .from("vw_projects_list")
    .select("*")

  if (error) {
    console.error(error)
    throw error
  }

  return data ?? []
}

export const getTaskList = async () => {
  const { data, error } = await db
    .from("task_types")
    .select("*")
    .eq("void", 1)

  if (error) {
    console.error(error)
    throw error
  }

  return data ?? []
}