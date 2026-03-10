import { db } from "@/lib/Supabase/supabaseClient";

export async function getAuthId(): Promise<string | null> {
  const {
    data: { session },
    error,
  } = await db.auth.getSession();

  if (error) {
    console.error("Error getting session:", error.message);
    return null;
  }

  return session?.user?.id ?? null;
}