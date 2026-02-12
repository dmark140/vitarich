// app/a_baja/eggstorage/new/api.ts
import { db } from "@/lib/Supabase/supabaseClient" 

export type EggStorageMngt = {
  id: number
  created_at: string
  created_by: string
  updated_at: string | null
  stor_temp: string | null
  room_temp: string | null
  stor_humi: string | null
  shell_start: string | null
  shell_end: string | null
  duration: number | null
  remarks: string | null
}

export type EggStorageInsert = Omit<
  EggStorageMngt,
  "id" | "created_at" | "created_by" | "updated_at"
> & {
  // allow passing duration optional; you may compute it client-side
  duration?: number | null
}

export type EggStorageUpdate = Partial<EggStorageInsert> & {
  id: number
}

export type EggStorageSelectParams = {
  id?: number
  created_by?: string
  isNullShellStart?: boolean
  isNullShellEnd?: boolean
  dateFrom?: string // ISO string
  dateTo?: string   // ISO string
  orderBy?: keyof EggStorageMngt
  ascending?: boolean
  limit?: number
}

const TABLE = "egg_storage_mngt"

export async function listEggStorage(params: EggStorageSelectParams = {}) {
  let q = db.from(TABLE).select("*")

  if (params.id != null) q = q.eq("id", params.id)
  if (params.created_by) q = q.eq("created_by", params.created_by)

  if (params.isNullShellStart === true) q = q.is("shell_start", null)
  if (params.isNullShellEnd === true) q = q.is("shell_end", null)

  if (params.dateFrom) q = q.gte("created_at", params.dateFrom)
  if (params.dateTo) q = q.lte("created_at", params.dateTo)

  const orderBy = params.orderBy ?? "created_at"
  q = q.order(orderBy as string, { ascending: params.ascending ?? false })

  if (params.limit) q = q.limit(params.limit)

  const { data, error } = await q
  if (error) throw error
  return data as EggStorageMngt[]
}

export async function getEggStorageById(id: number) {
  const { data, error } = await db
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as EggStorageMngt
}

export async function createEggStorage(payload: EggStorageInsert) {
  const { data, error } = await db
    .from(TABLE)
    .insert([
      {
        ...payload,
        // created_by comes from auth.uid() default (db), but okay to not send it
      },
    ])
    .select("*")
    .single()

  if (error) throw error
  return data as EggStorageMngt
}

export async function updateEggStorage(payload: EggStorageUpdate) {
  const { id, ...updates } = payload
  const { data, error } = await db
    .from(TABLE)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as EggStorageMngt
}

export async function deleteEggStorage(id: number) {
  const { error } = await db.from(TABLE).delete().eq("id", id)
  if (error) throw error
  return true
}
