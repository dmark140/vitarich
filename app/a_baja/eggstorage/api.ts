import { db } from "@/lib/Supabase/supabaseClient";
import { EggStorageMngt } from "@/lib/types";
 
// create egg storage record
export async function createEggStorage(
  payload: Partial<EggStorageMngt>
) {
  const payloadWithTimestamp = {
    ...payload,
    created_at: payload.created_at || new Date().toISOString(),
  };

  const { data, error } = await db
    .from("egg_storage_mngt")
    .insert(payloadWithTimestamp)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export type EggStorageFilter = Partial<{
  id: number;
  created_by: string; 
  room_temp: string;
  is_active: boolean;
}>;

export async function getEggStorages(
  filters?: EggStorageFilter,
  selectFields: (keyof EggStorageMngt)[] = ["*"] as any
) {
  let query = db.from("egg_storage_mngt").select(selectFields.join(","));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value as any);
      }
    });
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function updateEggStorage(
  id: number,
  payload: Partial<EggStorageMngt>
) {
  const { data, error } = await db
    .from("egg_storage_mngt")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
