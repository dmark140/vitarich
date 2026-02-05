// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// IMPORTANT: Use service_role key, not anon/public key
export const admin_db = createClient(supabaseUrl, supabaseServiceRoleKey);
