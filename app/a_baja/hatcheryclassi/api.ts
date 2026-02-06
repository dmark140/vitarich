import { db } from "@/lib/Supabase/supabaseClient";
import { HatchClassification } from "@/lib/types";

// craete hatchery classification record 
export async function createHatch(
  payload: Partial<HatchClassification>
) {
  // Set created_at to current timestamp if not provided
  const payloadWithTimestamp = {
    ...payload,
    created_at: payload.created_at || new Date().toISOString(),
  };

  const { data, error } = await db
    .from("hatch_classification")
    .insert(payloadWithTimestamp)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Dynamic SELECT with filters
 */
export type HatchFilter = Partial<{
  id: number;
  br_no: string;
  daterec: string;
  is_active: boolean;
}>;

export async function getHatches(
  filters?: HatchFilter,
  selectFields: (keyof HatchClassification)[] = ["*"] as any
) {
  let query = db
    .from("hatch_classification")
    .select(selectFields.join(","));

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function updateHatch(
  id: number,
  payload: Partial<HatchClassification>
) {
  const { data, error } = await db
    .from("hatch_classification")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

 