import { db } from '@/lib/Supabase/supabaseClient'
 
export async function getFarms() {
  const { data, error } = await db
    .from('farms')
    .select('*')
    .eq('void', 0)  
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching farms:', error.message);
    throw error;
  }
  
  return data;
}
 
export async function getFarmById(id: number) {
  const { data, error } = await db
    .from('farms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}