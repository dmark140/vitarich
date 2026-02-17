// app/a_dean/receiving/approval/api.ts
import { db } from '@/lib/Supabase/supabaseClient'
import { ApproveHatcheryDraftPayload } from '@/lib/types'

/* -------------------------------- TYPES -------------------------------- */

// export type ApproveHatcheryDraftPayload = {
//   docentry: number
//   posting_date: string // YYYY-MM-DD
//   temperature: string
//   humidity: string
//   soldTo: string
//   Attention: string
//   po_no: string
//   voyage_no: string
//   shipped_via: string
//   dr_num: string
//   no_of_crates: string
//   driver: string
//   plate_no: string
//   no_of_tray: string
//   serial_no: string
//   items: {
//     sku: string
//     actual_count: number
//   }[]
// }



/* ----------------------------- FETCH ITEMS ------------------------------ */

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

/* ----------------------------- APPROVE ---------------------------------- */

// export async function approveHatcheryDraft(
//   payload: ApproveHatcheryDraftPayload
// ) {
//   try {
//     const {
//       docentry,
//       posting_date,
//       temperature,
//       humidity,
//       items,
//     } = payload

//     const { error } = await db.rpc('approve_hatchery_draft', {
//       p_docentry: docentry,
//       p_posting_date: posting_date,
//       p_temperature: temperature,
//       p_humidity: humidity,
//       p_items: items, // JSONB
//     })

//     if (error) throw error

//     return { success: true }
//   } catch (error: any) {
//     console.error('Approve Error:', error)
//     return {
//       success: false,
//       error: error.message ?? 'Failed to approve document.',
//     }
//   }
// }

export async function approveHatcheryDraft(
  payload: ApproveHatcheryDraftPayload
) {
  try {
    const {
      docentry,
      posting_date,
      temperature,
      humidity,

      soldTo,
      Attention,
      po_no,
      voyage_no,
      shipped_via,
      dr_num,

      no_of_crates,
      no_of_tray,
      plate_no,
      driver,
      serial_no,

      items,
    } = payload

    const { error } = await db.rpc('approve_hatchery_draft', {
      p_docentry: docentry,
      p_posting_date: posting_date,
      p_temperature: temperature,
      p_humidity: humidity,

      p_soldto: soldTo,
      p_attention: Attention,
      p_po_no: po_no,
      p_voyage_no: voyage_no,
      p_shipped_via: shipped_via,
      p_dr_num: dr_num,

      p_no_of_crates: no_of_crates,
      p_no_of_tray: no_of_tray,
      p_plate_no: plate_no,
      p_driver: driver,
      p_serial_no: serial_no,

      p_items: items,
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



/* ----------------------------- REJECT ----------------------------------- */

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
