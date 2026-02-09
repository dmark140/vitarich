import { VwDmfReceivingDraftPending } from '@/lib/Defaults/DefaultTypes'
import { db } from '@/lib/Supabase/supabaseClient'

export async function getReceivingDraftPending() {
    const { data, error } = await db
        .from('vwdmf_receiving_draft_pending')
        .select('*')
        .order('posting_date', { ascending: false })

    if (error) {
        throw error
    }

    return data as VwDmfReceivingDraftPending[]
}
