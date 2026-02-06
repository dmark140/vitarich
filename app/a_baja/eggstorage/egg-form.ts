import { EggStorageMngt } from "@/lib/types"

export type EggStorageInsert = Omit<
  EggStorageMngt,
  "id" | "created_at" | "created_by" | "updated_at" | "updated_by"
>

/**
 * Update type (all optional, except id)
 */
export type EggStorageUpdate = Partial<EggStorageInsert>