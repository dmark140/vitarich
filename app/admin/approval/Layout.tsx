'use client'
import { Button } from '@/components/ui/button'
import DynamicTable from '@/components/ui/DataTableV2'
import Breadcrumb from '@/lib/Breadcrumb'
import { ColumnConfig, RowDataKey } from '@/lib/Defaults/DefaultTypes'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { approvePasswordReset, getApprovalRequests, rejectApproval } from './api'
import { getAuthId } from '@/lib/getAuthId'
import { getProfileByAuthId } from '../user/api'
import { toast } from 'sonner'
import { formatDateTime } from '@/lib/formatDate'
import { Badge } from '@/components/ui/badge'

export default function Layout() {
    const [receivedRows, setReceivedRows] = useState<RowDataKey[]>([])
    const [loading, setLoading] = useState(false)

    const receivedColumns: ColumnConfig[] = [
        { key: 'checkbox', label: '#', type: 'checkbox', disabled: false },
        { key: 'user_email', label: 'Employee Email', type: 'text', disabled: true },
        { key: 'request_type', label: 'Approval Type', type: 'text', disabled: true },
        { key: 'status', label: 'Status', type: 'status', disabled: true },
        { key: 'created_at', label: 'Date Requested', type: 'date', disabled: true },
        { key: 'remarks', label: 'Reason', type: 'text', disabled: true }
    ]

    async function loadApprovals() {
        setLoading(true)
        const data = await getApprovalRequests()
        console.log({ data })
        setReceivedRows(data ?? [])
        setLoading(false)
    }

    useEffect(() => {
        loadApprovals()
    }, [])
    // async function handleApprove() {
    //     const selectedRows = receivedRows.filter((row: any) => row.checkbox)
    //     if (selectedRows.length === 0) {
    //         toast("No records selected")
    //         return
    //     }
    //     setLoading(true)
    //     try {
    //         const authId = await getAuthId()

    //         if (!authId) {
    //             toast("Session error: Unable to retrieve auth ID")
    //             return
    //         }

    //         const user = await getProfileByAuthId(authId)

    //         if (!user) {
    //             toast("Session error: User profile not found")
    //             return
    //         }
    //         await Promise.all(
    //             selectedRows.map((row) => {
    //                 // console.log({ row }, user.id)
    //                 approvePasswordReset(row.id, user.id)
    //             }
    //             )
    //         )
    //         loadApprovals()
    //         toast("Selected requests approved successfully")
    //     } catch (error) {
    //         console.error("Approve password reset error:", error)
    //         toast("An unexpected error occurred while approving requests")
    //     } finally {
    //         setLoading(false)
    //     }
    //     loadApprovals()

    // }
    async function handleApprove() {
        const selectedRows = receivedRows.filter((row: any) => row.checkbox)

        if (selectedRows.length === 0) {
            toast("No records selected")
            return
        }

        setLoading(true)

        try {
            const authId = await getAuthId()

            if (!authId) {
                toast("Session error")
                return
            }

            const user = await getProfileByAuthId(authId)

            if (!user) {
                toast("User profile not found")
                return
            }

            await Promise.all(
                selectedRows.map((row) =>
                    fetch("/api/approval/approve", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            requestId: row.id,
                            approvedBy: user.id
                        })
                    })
                )
            )

            toast("Selected requests approved successfully")
            await loadApprovals()

        } catch (error) {
            console.error(error)
            toast("Error approving requests")
        } finally {
            setLoading(false)
        }
    }

    async function handleReject() {
        const selected = receivedRows.filter((r: any) => r.checkbox)
        const selectedRows = receivedRows.filter((row: any) => row.checkbox)
        if (selectedRows.length === 0) {
            toast("No records selected")
            return
        }
        if (selected.length === 0) return

        setLoading(true)

        await Promise.all(
            selected.map((row) => rejectApproval(row.id, 1))
        )

        await loadApprovals()
    }

    return (
        <div>
            <div className='px-2'>
                <div className='flex mt-8 justify-between items-center'>
                    <Breadcrumb
                        FirstPreviewsPageName='Admin'
                        CurrentPageName='Approval'
                    />
                    <div className='flex gap-2'>
                        <Button variant='destructive' onClick={handleReject} disabled={loading}>
                            <ThumbsDown /> Reject
                        </Button>
                        <Button onClick={handleApprove} disabled={loading}>
                            <ThumbsUp /> Approve
                        </Button>
                    </div>
                </div>
            </div>

            <div className='mt-4 bg-white rounded-2xl px-4'>
                <DynamicTable
                    columns={receivedColumns.map((col) => ({
                        key: col.key,
                        label: col.label,
                        align: 'left',
                        render: (row: RowDataKey) => {
                            const value = row[col.key]

                            if (col.key === 'checkbox') {
                                return (
                                    <input
                                        type="checkbox"
                                        checked={!!row.checkbox}
                                        onChange={(e) => {
                                            const updated = receivedRows.map((r) =>
                                                r.id === row.id ? { ...r, checkbox: e.target.checked } : r
                                            )
                                            setReceivedRows(updated)
                                        }}
                                    />
                                )
                            }

                            if (col.type === "date") return formatDateTime(String(value))
                            if (col.type === "status") return <Badge className='border-2 border-black/10 uppercase' variant={`${value === "pending" ? 'secondary' : "default"}`}>{value}</Badge>

                            if (value === null || value === undefined || value === '') return '-'

                            return String(value)
                        }
                    }))}
                    data={receivedRows}
                />
            </div>
        </div>
    )
}