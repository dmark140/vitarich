// app/a_baja/prewarming/new/api.ts
import { createClient } from "@supabase/supabase-js"

export type EggPreWarmingRow = {
  id: number
  created_at: string
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  egg_ref_no: string | null
  pre_temp: string | null
  egg_temp: string | null
  egg_temp_time_start: string | null
  egg_temp_time_end: string | null
  duration: number | null
  remarks: string | null
  is_active: boolean | null
}

export type EggPreWarmingInsert = {
  egg_ref_no?: string | null
  pre_temp?: string | null
  egg_temp?: string | null
  egg_temp_time_start?: string | null
  egg_temp_time_end?: string | null
  duration?: number | null
  remarks?: string | null
  is_active?: boolean | null
}

export type EggPreWarmingUpdate = Partial<EggPreWarmingInsert>

type Sort = { column: keyof EggPreWarmingRow; ascending?: boolean }

export type EggPreWarmingSelectParams = {
  search?: string // searches egg_ref_no + remarks
  is_active?: boolean
  limit?: number
  offset?: number
  sort?: Sort
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TABLE = "egg_pre_warming"

export async function listPreWarmings(params: EggPreWarmingSelectParams = {}) {
  const {
    search,
    is_active,
    limit = 50,
    offset = 0,
    sort = { column: "created_at", ascending: false },
  } = params

  let q = supabase
    .from(TABLE)
    .select("*")
    .range(offset, offset + limit - 1)

  if (typeof is_active === "boolean") q = q.eq("is_active", is_active)

  if (search?.trim()) {
    const s = search.trim()
    // OR filter across columns
    q = q.or(`egg_ref_no.ilike.%${s}%,remarks.ilike.%${s}%`)
  }

  if (sort?.column) {
    q = q.order(String(sort.column), { ascending: !!sort.ascending })
  }

  const { data, error } = await q
  if (error) throw error
  return data as EggPreWarmingRow[]
}

export async function getPreWarmingById(id: number) {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single()
  if (error) throw error
  return data as EggPreWarmingRow
}

export async function createPreWarming(payload: EggPreWarmingInsert) {
  const { data, error } = await supabase.from(TABLE).insert(payload).select("*").single()
  if (error) throw error
  return data as EggPreWarmingRow
}

export async function updatePreWarming(id: number, payload: EggPreWarmingUpdate) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as EggPreWarmingRow
}

/** Soft delete (recommended) */
export async function deactivatePreWarming(id: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as EggPreWarmingRow
}

/** Hard delete (only use if you really want) */
export async function deletePreWarming(id: number) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id)
  if (error) throw error
  return true
}
