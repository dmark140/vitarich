'use client'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/DataTable'
import { ColumnConfig, RowDataKey } from '@/lib/Defaults/DefaultTypes'
import React, { useEffect, useMemo, useState } from 'react'
import { getReceivingDraftPending } from './api'
import TableSkeleton from '@/components/ui/TableSkeleton'
import { sleep } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { toast } from 'sonner'
import ScannerModal from '@/components/ScannerModal'

export default function Layout() {
    const { setValue, getValue } = useGlobalContext()
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const handleScanSuccess = (text: string) => {
        setScannedData(text); // Save the result
        setIsScanning(false); // Close the "function" (modal)
        console.log("Processing scanned data:", text);
        const matchedRow = initialRows.find((row) => String(row.dr_num) === text);

        if (!matchedRow) {
            toast.error(`No record found with DR #: ${text}`);
            return;
        }

        if (matchedRow.status === "Approved") {
            toast.warning("Only pending documents are allowed to be edited on this module");
            return;
        }

        console.log("Found match via scan:", matchedRow);

        setValue("forApproval", { row: matchedRow });
        route.push("/a_dean/receiving/approval");


    };
    const route = useRouter()

    const [initialRows, setinitialRows] = useState<RowDataKey[]>([])
    const [loading, setLoading] = useState(true)
    const tableColumnsx: ColumnConfig[] = useMemo(
        () => [
            { key: 'id', label: 'Approval ID', type: 'text', disabled: true },
            { key: 'dr_num', label: 'Dr #', type: 'text', disabled: true },
            { key: 'status', label: 'Status', type: 'text', disabled: true },
            { key: 'decided_by_email', label: 'Decided By', type: 'text', disabled: true },
            { key: 'decided_at', label: 'Decision Date', type: 'text', disabled: true },
            { key: 'remarks', label: 'Remarks', type: 'text', disabled: true },
            { key: 'created_at', label: 'Created At', type: 'text', disabled: true },
            { key: 'action', label: 'Action', type: 'button', disabled: false },
        ],
        [initialRows]
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
        route.prefetch("/a_dean/receiving/approval")
    }, [])

    return (
        <div>
            {isScanning && (
                <ScannerModal
                    onResult={handleScanSuccess}
                    onClose={() => setIsScanning(false)}
                />
            )}
            <div className='mx-4 flex justify-between items-center mb-4 mt-4'>
                <h1 className='text-2xl font-bold'>Receiving</h1>
                <div className=''>
                    <Button
                        onClick={() => setIsScanning(true)}
                    >Scan Search</Button>
                </div>
            </div>

            <div className='px-4'>
                List of Delivery for Receiving from Breeder
                {loading && <div className='max-w-xl'><TableSkeleton /></div>}
                {!loading && <DataTable
                    rows={initialRows}
                    columns={tableColumnsx}
                    onChange={() => console.log("trigger on change")}
                    rowOnClick={(e) => {
                        // console.log({ e })
                        if (e.row.status === "Approved") {
                            toast.warning("Only pending documents are allowed to be edited on this module")
                            return
                        }
                        console.log({ e })
                        setValue("forApproval", e)
                        route.push("/a_dean/receiving/approval")
                    }}
                    DisableAddLine
                />}

            </div>
            {/* <Button onClick={() => console.log({ initialRows })}>check initialRows</Button> */}
        </div>
    )
}
