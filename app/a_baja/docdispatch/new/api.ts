import { db } from "@/lib/Supabase/supabaseClient"

export type SkuClassification = "SALEABLE" | "BY_PRODUCT"
export type UomType = "PCS" | "TRAY" | "BOX" | "CRATE"

export type DispatchDoc = {
  id: number
  created_at: string
  created_by: string | null
  updated_at: string | null
  updated_by: string | null

  doc_date: string // YYYY-MM-DD
  dr_no: string

  farm_name: string
  hauler_name: string | null
  hauler_plate_no: string | null
  truck_seal_no: string | null

  chick_van_temp_c: number | null
  number_of_fans: number | null

  remarks: string | null
  is_active: boolean
}

export type DispatchDocItem = {
  id: number
  dispatch_doc_id: number
  doc_batch_code: string
  sku_name: string
  classification: SkuClassification | null
  uom: UomType | null
  qty: number
  created_at: string
  updated_at: string | null
}

export type DispatchDocItemInsert = {
  doc_batch_code: string
  sku_name: string
  classification: SkuClassification | null
  uom: UomType | null
  qty: number
}

export type DispatchDocUpsertPayload = {
  doc_date: string
  dr_no: string
  farm_name: string
  hauler_name: string | null
  hauler_plate_no: string | null
  truck_seal_no: string | null
  chick_van_temp_c: number | null
  number_of_fans: number | null
  remarks: string | null
  items: DispatchDocItemInsert[]
}

export async function listDispatchDocs() {
  const { data, error } = await db
    .from("dispatch_doc")
    .select(
      "id, doc_date, dr_no, farm_name, hauler_name, hauler_plate_no, truck_seal_no, chick_van_temp_c, number_of_fans, remarks, is_active, created_at"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as Partial<DispatchDoc>[]
}

export async function getDispatchDocById(id: number) {
  const { data: header, error: hErr } = await db
    .from("dispatch_doc")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (hErr) throw hErr
  if (!header) return null

  const { data: items, error: iErr } = await db
    .from("dispatch_doc_item")
    .select("*")
    .eq("dispatch_doc_id", id)
    .order("id", { ascending: true })

  if (iErr) throw iErr

  return {
    header: header as DispatchDoc,
    items: (items ?? []) as DispatchDocItem[],
  }
}

export async function createDispatchDoc(payload: DispatchDocUpsertPayload) {
  // 1) insert header
  const { items, ...header } = payload

  const { data: inserted, error } = await db
    .from("dispatch_doc")
    .insert({
      ...header,
      is_active: true,
    })
    .select("id")
    .single()

  if (error) throw error

  // 2) insert items
  if (items?.length) {
    const { error: itemErr } = await db.from("dispatch_doc_item").insert(
      items.map((it) => ({
        dispatch_doc_id: inserted.id,
        ...it,
      }))
    )
    if (itemErr) throw itemErr
  }

  return inserted.id as number
}

export async function updateDispatchDoc(id: number, payload: DispatchDocUpsertPayload) {
  const { items, ...header } = payload

  // 1) update header
  const { error: uErr } = await db
    .from("dispatch_doc")
    .update({
      ...header,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (uErr) throw uErr

  // 2) replace items (simple + reliable approach)
  const { error: dErr } = await db.from("dispatch_doc_item").delete().eq("dispatch_doc_id", id)
  if (dErr) throw dErr

  if (items?.length) {
    const { error: iErr } = await db.from("dispatch_doc_item").insert(
      items.map((it) => ({
        dispatch_doc_id: id,
        ...it,
      }))
    )
    if (iErr) throw iErr
  }
}

export async function softDeleteDispatchDoc(id: number) {
  const { error } = await db
    .from("dispatch_doc")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error
}

/**
 * Optional helpers for dropdowns (no master tables given).
 * These will pull distinct values from existing saved docs.
 */
export async function listDistinctHaulers() {
  const { data, error } = await db
    .from("dispatch_doc")
    .select("hauler_name")
    .not("hauler_name", "is", null)
    .eq("is_active", true)
    .limit(1000)

  if (error) throw error
  const set = new Set<string>()
  ;(data ?? []).forEach((r: any) => {
    if (r?.hauler_name) set.add(String(r.hauler_name))
  })
  return Array.from(set).sort()
}

export async function listDistinctPlates() {
  const { data, error } = await db
    .from("dispatch_doc")
    .select("hauler_plate_no")
    .not("hauler_plate_no", "is", null)
    .eq("is_active", true)
    .limit(1000)

  if (error) throw error
  const set = new Set<string>()
  ;(data ?? []).forEach((r: any) => {
    if (r?.hauler_plate_no) set.add(String(r.hauler_plate_no))
  })
  return Array.from(set).sort()
}