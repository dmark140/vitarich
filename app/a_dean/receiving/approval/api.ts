// app/a_dean/receiving/approval/api.ts
import { db } from '@/lib/Supabase/supabaseClient'


export async function getHatcheryDraftItems(docEntryId: number) {
  try {
    const { data, error } = await db
      .from('hatchery_draft_items')
      .select('*')
      .eq('docentry', docEntryId)
      .order('id', { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Fetch Error:', error)
    return { success: false, error: 'Failed to retrieve hatchery items.' }
  }
}

export async function approveHatcheryDraft(docEntryId: number) {
  try {
    const { error } = await db.rpc('approve_hatchery_draft', {
      p_docentry: docEntryId,
    })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Approve Error:', error)
    return {
      success: false,
      error: error.message ?? 'Failed to approve document.',
    }
  }
}

export async function rejectHatcheryDraft(
  docEntryId: number,
  remarks: string
) {
  try {
    const { error } = await db.rpc('reject_hatchery_draft', {
      p_docentry: docEntryId,
      p_remarks: remarks,
    })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Reject Error:', error)
    return {
      success: false,
      error: error.message ?? 'Failed to reject document.',
    }
  }
}
