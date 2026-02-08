import { EggStorageMngt } from "@/lib/types"
 
export type EggStorageForm = Omit<
  EggStorageMngt,
  "id" | "created_at" | "created_by" | "updated_at" | "updated_by"
>;