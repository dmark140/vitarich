import { db } from "@/lib/Supabase/supabaseClient"

 

 

export type EggTransferProcess = {
  id: number
  created_at: string
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  ref_no: string | null
  farm_source: string | null
  trans_date_start: string | null
  trans_date_end: string | null
  duration: number | null
  num_bangers: number | null
  total_egg_transfer: number | null
}

export async function listEggTransfers() {
  const { data, error } = await db
    .from("egg_transfer_process")
    .select("*")
    .order("id", { ascending: false })

  if (error) throw error
  return (data ?? []) as EggTransferProcess[]
}

export async function getEggTransferById(id: number) {
  const { data, error } = await db
    .from("egg_transfer_process")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data as EggTransferProcess
}

export async function createEggTransfer(payload: Partial<EggTransferProcess>) {
  const { data, error } = await db
    .from("egg_transfer_process")
    .insert(payload)
    .select("*")
    .single()

  if (error) throw error
  return data as EggTransferProcess
}

export async function updateEggTransfer(id: number, payload: Partial<EggTransferProcess>) {
  const { data, error } = await db
    .from("egg_transfer_process")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return data as EggTransferProcess
}

export async function deleteEggTransfer(id: number) {
  const { error } = await db.from("egg_transfer_process").delete().eq("id", id)
  if (error) throw error
  return true
}
