"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"

import {
    getStorageLocations,
    generateStorageStructure
} from "./api"
import {
    buildStorageTree,
    StorageNode
} from "@/lib/utils/buildStorageTree"
import StorageTree from "./StorageTree"
import Breadcrumb from "@/lib/Breadcrumb"
import { useGlobalContext } from "@/lib/context/GlobalContext"
import { Plus } from "lucide-react"

export default function StoragePage() {
    const { getValue } = useGlobalContext();

    // const warehouseId = 3 //  
    const [warehouseId, setwarehouseId] = useState(0)
    const [tree, setTree] = useState<StorageNode[]>([])
    const [selected, setSelected] = useState<StorageNode | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)

    useEffect(() => {
        // setwarehouseId(getValue("warehouseId"))
        setwarehouseId(3)
    }, [])



    // ------------------------
    // GENERATOR STATE
    // ------------------------

    const [roomStart, setRoomStart] = useState(1)
    const [roomEnd, setRoomEnd] = useState(1)

    const [rackStart, setRackStart] = useState(0)
    const [rackEnd, setRackEnd] = useState(0)

    const [binStart, setBinStart] = useState(0)
    const [binEnd, setBinEnd] = useState(0)

    const [subStart, setSubStart] = useState(0)
    const [subEnd, setSubEnd] = useState(0)

    // ------------------------
    // HIERARCHY-AWARE SUMMARY
    // ------------------------

    const generationSummary = useMemo(() => {

        const safeRange = (start: number, end: number) => {
            if (start === 0 && end === 0) return 0
            if (end < start) return 0
            return end - start + 1
        }

        const rooms = safeRange(roomStart, roomEnd)
        if (rooms === 0) {
            return { rooms: 0, racks: 0, bins: 0, subBins: 0, total: 0 }
        }

        const racksPerRoom = safeRange(rackStart, rackEnd)
        if (racksPerRoom === 0) {
            return {
                rooms,
                racks: 0,
                bins: 0,
                subBins: 0,
                total: rooms
            }
        }

        const binsPerRack = safeRange(binStart, binEnd)
        if (binsPerRack === 0) {
            return {
                rooms,
                racks: rooms * racksPerRoom,
                bins: 0,
                subBins: 0,
                total: rooms * racksPerRoom
            }
        }

        const subBinsPerBin = safeRange(subStart, subEnd)
        if (subBinsPerBin === 0) {
            return {
                rooms,
                racks: rooms * racksPerRoom,
                bins: rooms * racksPerRoom * binsPerRack,
                subBins: 0,
                total: rooms * racksPerRoom * binsPerRack
            }
        }

        return {
            rooms,
            racks: rooms * racksPerRoom,
            bins: rooms * racksPerRoom * binsPerRack,
            subBins: rooms * racksPerRoom * binsPerRack * subBinsPerBin,
            total: rooms * racksPerRoom * binsPerRack * subBinsPerBin
        }

    }, [
        roomStart, roomEnd,
        rackStart, rackEnd,
        binStart, binEnd,
        subStart, subEnd
    ])

    const codePreview = useMemo(() => {

        const pad = (num: number) => num.toString().padStart(2, "0")

        const preview: string[] = []

        if (generationSummary.rooms === 0) return preview

        for (let r = roomStart; r <= roomEnd && preview.length < 5; r++) {

            const roomCode = `R${pad(r)}`

            if (generationSummary.racks === 0) {
                preview.push(roomCode)
                continue
            }

            for (let rk = rackStart; rk <= rackEnd && preview.length < 5; rk++) {

                const rackCode = `${roomCode}-RK${pad(rk)}`

                if (generationSummary.bins === 0) {
                    preview.push(rackCode)
                    continue
                }

                for (let b = binStart; b <= binEnd && preview.length < 5; b++) {

                    const binCode = `${rackCode}-B${pad(b)}`

                    if (generationSummary.subBins === 0) {
                        preview.push(binCode)
                        continue
                    }

                    for (let s = subStart; s <= subEnd && preview.length < 5; s++) {
                        const subCode = `${binCode}-S${pad(s)}`
                        preview.push(subCode)
                    }
                }
            }
        }

        return preview

    }, [
        generationSummary,
        roomStart, roomEnd,
        rackStart, rackEnd,
        binStart, binEnd,
        subStart, subEnd
    ])


    // ------------------------
    // FETCH TREE
    // ------------------------

    const fetchData = useCallback(async () => {

        if (warehouseId <= 0) return
        if (warehouseId == undefined) return
        setIsLoading(true)
        const result = await getStorageLocations(warehouseId)

        if (result.success && Array.isArray(result.data)) {
            const builtTree = buildStorageTree(result.data)
            setTree(builtTree)
        }

        setIsLoading(false)
    }, [warehouseId])

    useEffect(() => {
        if (warehouseId == 0) return
        fetchData()
    }, [warehouseId])

    // ------------------------
    // AUTO DISABLE LOWER LEVELS
    // ------------------------

    useEffect(() => {
        if (rackStart === 0 && rackEnd === 0) {
            setBinStart(0)
            setBinEnd(0)
            setSubStart(0)
            setSubEnd(0)
        }
    }, [rackStart, rackEnd])

    useEffect(() => {
        if (binStart === 0 && binEnd === 0) {
            setSubStart(0)
            setSubEnd(0)
        }
    }, [binStart, binEnd])

    return (
        <div className="">
            <div className="">
                <div className="flex items-center  justify-between p-4">
                    <Breadcrumb
                        CurrentPageName="Bin Creation"
                    />

                    <Button
                        className=""
                        disabled={generationSummary.total <= 0}
                        onClick={() => setOpenConfirm(true)}
                    >
                        <Plus /> Generate Bin
                    </Button>

                </div>
                {/* LEFT PANEL */}
                <div className=" max-w-content mx-auto  p-4 space-y-6">

                    {/* GENERATOR */}
                    <div className="border rounded-lg p-5 space-y-5 bg-muted/30">

                        <div>
                            <h2 className="font-semibold text-base">
                                Structured Pattern Generator
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Automatically generate warehouse hierarchy using structured numbering.
                            </p>
                        </div>

                        {/* ROOM */}
                        <div>
                            <label className="text-sm font-medium">
                                Room Range (Prefix: R)
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <Input type="number" value={roomStart}
                                    onChange={(e) => setRoomStart(Number(e.target.value))}
                                />
                                <Input type="number" value={roomEnd}
                                    onChange={(e) => setRoomEnd(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* RACK */}
                        <div>
                            <label className="text-sm font-medium">
                                Rack Range (Prefix: RK)
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <Input type="number"
                                    disabled={generationSummary.rooms === 0}
                                    value={rackStart}
                                    onChange={(e) => setRackStart(Number(e.target.value))}
                                />
                                <Input type="number"
                                    disabled={generationSummary.rooms === 0}
                                    value={rackEnd}
                                    onChange={(e) => setRackEnd(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* BIN */}
                        <div>
                            <label className="text-sm font-medium">
                                Bin Range (Prefix: B)
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <Input type="number"
                                    disabled={generationSummary.racks === 0}
                                    value={binStart}
                                    onChange={(e) => setBinStart(Number(e.target.value))}
                                />
                                <Input type="number"
                                    disabled={generationSummary.racks === 0}
                                    value={binEnd}
                                    onChange={(e) => setBinEnd(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* SUBBIN */}
                        <div>
                            <label className="text-sm font-medium">
                                SubBin Range (Prefix: S)
                            </label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <Input type="number"
                                    disabled={generationSummary.bins === 0}
                                    value={subStart}
                                    onChange={(e) => setSubStart(Number(e.target.value))}
                                />
                                <Input type="number"
                                    disabled={generationSummary.bins === 0}
                                    value={subEnd}
                                    onChange={(e) => setSubEnd(Number(e.target.value))}
                                />
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="p-4 rounded-md bg-background border text-sm">
                            <p className="font-medium mb-2">Generation Preview</p>

                            <ul className="space-y-1 text-muted-foreground">
                                <li>Rooms: {generationSummary.rooms}</li>
                                <li>Racks: {generationSummary.racks}</li>
                                <li>Bins: {generationSummary.bins}</li>
                                <li>SubBins: {generationSummary.subBins}</li>
                            </ul>

                            <p className="mt-3 font-semibold">
                                Total Nodes to be inserted: {generationSummary.total}
                            </p>
                        </div>


                    </div>

                    {/* TREE */}
                    {/* {isLoading ? (
          <p>Loading...</p>
        ) : (
          <StorageTree
            nodes={tree}
            onSelect={(node) => setSelected(node)}
          />
        )} */}

                </div>

                {/* RIGHT PANEL */}
                {/* <div className="col-span-2 border rounded-xl p-6">
        {selected ? (
          <div>
            <h2 className="font-semibold text-lg">
              {selected.full_location_code}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Level: {selected.level_no}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select a location from the tree.
          </p>
        )}
      </div> */}

                {/* CONFIRM DIALOG */}
                <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Structure Generation</DialogTitle>
                            <DialogDescription>
                                The system will generate a structured warehouse hierarchy.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="text-sm space-y-4">

                            <div className="p-3 rounded-md border bg-muted/40">
                                <p className="font-medium mb-2">Structure Summary</p>

                                <ul className="space-y-1 text-muted-foreground">
                                    <li>Rooms: {generationSummary.rooms}</li>
                                    <li>Racks: {generationSummary.racks}</li>
                                    <li>Bins: {generationSummary.bins}</li>
                                    <li>SubBins: {generationSummary.subBins}</li>
                                </ul>

                                <p className="mt-3 font-semibold">
                                    Total Nodes to be inserted: {generationSummary.total}
                                </p>
                            </div>

                            {codePreview.length > 0 && (
                                <div className="p-3 rounded-md border bg-background">
                                    <p className="font-medium mb-2">Sample Generated Codes</p>

                                    <ul className="space-y-1 text-muted-foreground">
                                        {codePreview.map((code, index) => (
                                            <li key={index}>{code}</li>
                                        ))}
                                    </ul>

                                    {generationSummary.total > 5 && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            ...and more
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="text-xs text-muted-foreground">
                                This action will insert structured storage locations into the selected warehouse.
                                Please confirm before proceeding.
                            </div>

                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenConfirm(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    const result = await generateStorageStructure({
                                        warehouse_id: warehouseId,
                                        room_start: roomStart,
                                        room_end: roomEnd,
                                        rack_start: rackStart,
                                        rack_end: rackEnd,
                                        bin_start: binStart,
                                        bin_end: binEnd,
                                        subbin_start: subStart,
                                        subbin_end: subEnd
                                    })

                                    if (result.success) {
                                        setOpenConfirm(false)
                                        fetchData()
                                    } else {
                                        alert(result.error)
                                    }
                                }}
                            >
                                Confirm & Generate
                            </Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>

            </div>
        </div>
    )
}
