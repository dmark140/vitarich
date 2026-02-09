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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { approveHatcheryDraft, getHatcheryDraftItems, rejectHatcheryDraft } from './api'
import { DataRecordApproval } from '@/lib/types'
import { today } from '@/lib/Defaults/DefaultValues'

type DraftItem = {
    id: number
    sku: string
    UoM: string
    expected_count: number
    actual_count?: number
    breeder_ref?: string
    qty_tray?: number
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
        if (!header?.docentry) return
        const fetchItems = async () => {
            setLoading(true)
            const { data, error } = await getHatcheryDraftItems(Number(header.docentry))
            if (!error && data) setItems(data)
            setLoading(false)
        }
        fetchItems()
    }, [header])

    const approveDocument = async () => {
        if (!header?.docentry) return
        const res = await approveHatcheryDraft(Number(header.uid))
        if (!res.success) { alert(res.error); return }
        alert('Document approved and posted to inventory')
        location.reload()
    }

    const rejectDocument = async () => {
        if (!header?.uid) return
        const res = await rejectHatcheryDraft(Number(header.uid), 'Rejected by approver')
        if (!res.success) { alert(res.error); return }
        alert('Document rejected')
        location.reload()
    }

    if (!header) return null

    return (
        <div className="">

            <Card className="w-full border-none shadow-none bg-background p-0 m-0">
                <CardHeader className="border-b ">
                    <div className='flex justify-between'>
                        <div className=" ">
                            <CardTitle className="text-xl  uppercase tracking-tight ">Receiving Form</CardTitle>
                            <Badge variant="secondary" className=" absolute">{header.status}</Badge>
                        </div>

                        <div className="flex justify-start gap-3">
                            <Button onClick={rejectDocument} variant={'destructive'}> Reject</Button>
                            <Button onClick={approveDocument}> Receive</Button>

                        </div>
                    </div>
                </CardHeader>

                <CardContent className=" ">
                    {/* TOP SECTION: FIELDS PLACEMENT PER EXCEL */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div className="grid gap-1.5">
                                <Label className="text-xs uppercase text-muted-foreground">Posting Date</Label>
                                <Input
                                    type="date"
                                    defaultValue={header.posting_date || today}
                                    className="bg-orange-50/50 "
                                />
                                {/* <Input value={header.posting_date} readOnly className="bg-orange-50/50 " /> */}
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs uppercase text-muted-foreground">DR Number</Label>
                                <div className="flex gap-2">
                                    <Input value={header.id} readOnly className="" />
                                    {/* <Button variant="outline" size="icon" className="shrink-0">
                                        <span className="sr-only">View Attachment</span>
                                        📷
                                    </Button> */}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div className="grid gap-1.5">
                                <Label className="text-xs uppercase text-muted-foreground">Temperature</Label>
                                <Input value="26C" readOnly />
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-xs uppercase text-muted-foreground">Humidity</Label>
                                <Input value="60%" readOnly />
                            </div>
                        </div>

                        {/* Full Width Remarks */}
                        <div className="col-span-2 grid gap-1.5">
                            <Label className="text-xs uppercase text-muted-foreground">Remarks</Label>
                            <Input value="SAMPLE REMARKS" readOnly />
                        </div>
                    </div>

                    {/* ITEMS SECTION */}
                    <div className="space-y-3">
                        <Label className="text-sm  text-green-700 uppercase">Items</Label>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-slate-50/20">
                                    <TableRow>
                                        <TableHead className="text-green-700  border-r">BREEDER REF. NO.</TableHead>
                                        <TableHead className=" border-r">EGG SKU</TableHead>
                                        <TableHead className=" border-r">UoM</TableHead>
                                        {/* <TableHead className=" border-r text-center">QTY</TableHead> */}
                                        <TableHead className=" border-r text-center">Expected Count</TableHead>
                                        <TableHead className=" text-center">Actual Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-transparent">
                                            <TableCell className="border-r bg-slate-50/30">01FARM1-B1-P1-010126</TableCell>
                                            <TableCell className="border-r">{item.sku}</TableCell>
                                            <TableCell className="border-r">{item.UoM}</TableCell>
                                            {/* <TableCell className="border-r text-center">2</TableCell> */}
                                            <TableCell className="border-r text-center bg-slate-50/30 ">
                                                {item.expected_count}
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <Input className="h-8 border-none text-center focus-visible:ring-1" placeholder="Input" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}