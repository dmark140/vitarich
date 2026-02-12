'use client'

import { useEffect, useState, useCallback } from 'react'
import { getStorageLocations } from './api'
import { buildStorageTree, StorageNode } from '@/lib/utils/buildStorageTree'
import StorageTree from './StorageTree'


export default function StoragePage() {

    const [tree, setTree] = useState<StorageNode[]>([])
    const [selected, setSelected] = useState<StorageNode | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const warehouseId = 3 // later dynamic

    const fetchData = useCallback(async () => {
        setIsLoading(true)

        const result = await getStorageLocations(warehouseId)
        console.log({ result })
        if (result.success && Array.isArray(result.data)) {
            const builtTree = buildStorageTree(result.data)
            setTree(builtTree)
        }

        setIsLoading(false)
    }, [warehouseId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-120px)]">

            {/* Tree Panel */}
            <div className="border rounded-lg p-3 overflow-auto">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <StorageTree
                        nodes={tree}
                        onSelect={(node: any) => setSelected(node)}
                    />
                )}
            </div>

            {/* Form Panel */}
            <div className="col-span-2 border rounded-lg p-4">
                {selected ? (
                    <div>
                        <h2 className="font-semibold mb-2">
                            {selected.full_location_code}
                        </h2>

                        <p>Level: {selected.level_no}</p>
                        <p>Lowest Level: {selected.is_lowest_level ? 'Yes' : 'No'}</p>
                    </div>
                ) : (
                    <p>Select a location</p>
                )}
            </div>

        </div>
    )
}
