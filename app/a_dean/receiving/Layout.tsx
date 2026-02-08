'use client'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/DataTable'
import { ColumnConfig, RowDataKey } from '@/lib/Defaults/DefaultTypes'
import React, { useEffect, useMemo, useState } from 'react'
import { getReceivingDraftPending } from './api'
import TableSkeleton from '@/components/ui/TableSkeleton'
import { sleep } from '@/lib/utils'

export default function Layout() {
    const [initialRows, setinitialRows] = useState<RowDataKey[]>([])
    const [loading, setLoading] = useState(true)
    const tableColumnsx: ColumnConfig[] = useMemo(
        () => [
            { key: 'id', label: 'DR No.', type: 'text', disabled: true },
            { key: 'posting_date', label: 'Date Posted', type: 'text', disabled: true },
            { key: 'email', label: 'Posted By', type: 'text', disabled: true },
            { key: 'status', label: 'Status', type: 'text', disabled: true },
            { key: 'action', label: 'Action', type: 'button', disabled: false },
        ],
        [/*sourceList, itemListSource*/]
    )

    const getData = async () => {
        setLoading(true)
        const date = await getReceivingDraftPending()
        console.log({ date })
        setinitialRows(date)
        setLoading(!true)

    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div>
            <div className='mx-4 flex justify-between items-center mb-4 mt-4'>
                <h1 className='text-2xl font-bold'>Receiving</h1>
                <div className=''>
                    <Button>Scan Search</Button>
                </div>
            </div>

            <div className='px-4'>
                List of Delivery for Receiving from Breeder
                {loading && <div className='max-w-xl'><TableSkeleton /></div>}
                {!loading && <DataTable
                    rows={initialRows}
                    columns={tableColumnsx}
                    onChange={() => console.log("trigger on change")}
                    rowOnClick={() => console.log("row click")}
                    DisableAddLine

                />}

            </div>
        </div>
    )
}
