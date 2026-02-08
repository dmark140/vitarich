import { db } from "@/lib/Supabase/supabaseClient";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";



export async function toggleUserPermission(
  userId: string,
  groupName: string,
  title: string,
  checked: boolean,
  url?: string,

) {
  try {
    const { data, error } = await db
      .from("user_permissions")
      .upsert(
        {
          user_id: userId,
          group_name: groupName,
          title,
          is_visible: checked,
          updated_by: userId,
          ilink: url || "",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,group_name,title" }
      )
      .select();

    if (error) throw error;
    toast.success(`Permission ${checked ? "granted" : "revoked"}: ${groupName} - ${title}`
    );
    console.log("Permission updated:", data);
    return data;
  } catch (err) {
    console.error("Error updating permission:", err);
    throw err;
  }
}



export async function getUserPermissions(userId: string) {
  try {
    const { data, error } = await db
      .from("user_permissions")
      .select("group_name, title, is_visible")
      .eq("user_id", userId)
      .eq("is_visible", true);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.log("Error fetching user permissions:", err);
    throw err;
  }
}