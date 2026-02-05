import { HatchClassification } from "@/lib/types";

export type HatchForm = Omit<
  HatchClassification,
  "id" | "created_at" | "created_by" | "updated_at" | "updated_by"
>;