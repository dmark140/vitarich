import { db } from "@/lib/Supabase/supabaseClient"

export type ChickGradingProcess = {
  id: number
  created_at: string
  created_by: string | null
  updated_at: string | null
  updated_by: string | null

  batch_code: string
  egg_ref_no: string | null

  class_a: number | null
  class_b: number | null
  class_a_junior: number | null
  class_c: number | null
  cull_chicks: number | null
  dead_chicks: number | null
  infertile: number | null
  dead_germ: number | null
  live_pip: number | null
  dead_pip: number | null
  unhatched: number | null
  rotten: number | null

  chick_room_temperature: number | null
  grading_personnel: string | null
  grading_datetime: string // timestamptz

  // GENERATED columns (read-only)
  total_chicks: number | null
  good_quality_chicks: number | null
  quality_grade_rate: number | null
  cull_rate: number | null
}

const TABLE = "chick_grading_process"

export async function listChickGradingProcess() {
  const { data, error } = await db.from(TABLE).select("*").order("id", { ascending: false })
  if (error) throw error
  return (data ?? []) as ChickGradingProcess[]
}

export async function getChickGradingProcessById(id: number) {
  const { data, error } = await db.from(TABLE).select("*").eq("id", id).single()
  if (error) throw error
  return data as ChickGradingProcess
}

export type ChickGradingProcessCreate = Omit<
  ChickGradingProcess,
  | "id"
  | "created_at"
  | "created_by"
  | "updated_at"
  | "updated_by"
  | "total_chicks"
  | "good_quality_chicks"
  | "quality_grade_rate"
  | "cull_rate"
>

export async function createChickGradingProcess(payload: ChickGradingProcessCreate) {
  const { data, error } = await db.from(TABLE).insert([payload]).select("*").single()
  if (error) throw error
  return data as ChickGradingProcess
}

export type ChickGradingProcessUpdate = Partial<ChickGradingProcessCreate>

export async function updateChickGradingProcess(id: number, payload: ChickGradingProcessUpdate) {
  const { data, error } = await db
    .from(TABLE)
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as ChickGradingProcess
}

export async function deleteChickGradingProcess(id: number) {
  const { error } = await db.from(TABLE).delete().eq("id", id)
  if (error) throw error
  return true
}

/** Egg reference dropdown source */
export async function listEggReferences() {
  const { data, error } = await db
    .from("egg_hatchery_process")
    .select("egg_ref")
    .order("egg_ref", { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => r.egg_ref).filter(Boolean) as string[]
}
