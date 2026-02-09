
'use client'

import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { approveHatcheryDraft, getHatcheryDraftItems, rejectHatcheryDraft } from './api'
import { DataRecordApproval } from '@/lib/types'

type DraftItem = {
    id: number
    sku: string
    UoM: string
    expected_count: number
}

export default function ApprovalDecisionForm() {
    const { getValue } = useGlobalContext()

    const [header, setHeader] = useState<DataRecordApproval | null>(null)
    const [items, setItems] = useState<DraftItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const contextData = getValue('forApproval')
        if (contextData?.row) {
            setHeader(contextData.row)
        }
    }, [getValue])

    useEffect(() => {
        if (!header?.uid) return

        const fetchItems = async () => {
            setLoading(true)
            const { data, error } = await getHatcheryDraftItems(Number(header.uid))
            if (!error && data) {
                setItems(data)
            }
            setLoading(false)
        }

        fetchItems()
    }, [header])


    const approveDocument = async () => {
        if (!header?.uid) return

        const res = await approveHatcheryDraft(Number(header.uid))
        if (!res.success) {
            alert(res.error)
            return
        }

        alert('Document approved and posted to inventory')
        location.reload()
    }

    const rejectDocument = async () => {
        if (!header?.uid) return

        const res = await rejectHatcheryDraft(
            Number(header.uid),
            'Rejected by approver'
        )

        if (!res.success) {
            alert(res.error)
            return
        }

        alert('Document rejected')
        location.reload()
    }


    if (!header) return null

    return (
        <div className="space-y-4 p-4">

            {/* HEADER (SAP B1 style) */}
            <Card>
                <CardHeader>
                    <CardTitle>Approval Decision</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Document No.</p>
                        <p className="font-medium">{header.id}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Posting Date</p>
                        <p className="font-medium">{header.posting_date}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Created By</p>
                        <p className="font-medium truncate">{header.email}</p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <Badge variant="outline">{header.status}</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* LINE ITEMS (GRID) */}
            <Card>
                <CardHeader>
                    <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10">#</TableHead>
                                <TableHead>Item Code</TableHead>
                                <TableHead>UoM</TableHead>
                                <TableHead className="text-right">Expected Qty</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.UoM}</TableCell>
                                    <TableCell className="text-right">
                                        {item.expected_count}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {!loading && items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No items found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* DECISION BUTTONS */}
            <div className="flex justify-end gap-2">
                <Button variant="destructive" onClick={rejectDocument}  >
                    Reject
                </Button>
                <Button onClick={approveDocument}  >
                    Approve
                </Button>
            </div>
        </div>
    )
}
