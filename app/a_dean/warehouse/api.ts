// app/a_dean/warehouse/api.ts
import { db } from "@/lib/Supabase/supabaseClient"
import { WarehouseData } from "@/lib/types"

export async function getWarehouses(id?: string) {
    try {
        const query = db.from('i_warehouse').select('*');

        if (id) {
            const { data, error } = await query
                .eq('id', id)
                .single();

            if (error) throw error;
            return { success: true, data: data as WarehouseData };
        }
        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data: data as WarehouseData[] };

    } catch (error: any) {
        console.error('Error fetching warehouse:', error.message);
        return { success: false, error: error.message };
    }
}