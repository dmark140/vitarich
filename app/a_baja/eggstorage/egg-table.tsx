// app/a_baja/eggstorage/egg-table.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { listEggStorage, deleteEggStorage, EggStorageMngt } from "./new/api"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function EggTable() {
  const [items, setItems] = useState<EggStorageMngt[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")

  async function load() {
    try {
      setLoading(true)
      const data = await listEggStorage({ orderBy: "created_at", ascending: false })
      setItems(data)
    } catch (err: any) {
      alert(err?.message ?? "Failed to load.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((x) => {
      return (
        (x.stor_temp ?? "").toLowerCase().includes(s) ||
        (x.room_temp ?? "").toLowerCase().includes(s) ||
        (x.stor_humi ?? "").toLowerCase().includes(s) ||
        (x.remarks ?? "").toLowerCase().includes(s) ||
        String(x.id).includes(s)
      )
    })
  }, [items, q])

  async function onDelete(id: number) {
    if (!confirm("Delete this record?")) return
    try {
      await deleteEggStorage(id)
      await load()
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete.")
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>Egg Storage Records</CardTitle>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/a_baja/eggstorage/new">New</Link>
          </Button>
          <Button variant="secondary" onClick={load} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Storage Temp</TableHead>
                <TableHead>Room Temp</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Remarks</TableHead>
                {/* <TableHead className="w-40 text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>{x.id}</TableCell>
                  <TableCell>
                    {x.created_at ? new Date(x.created_at).toLocaleString() : ""}
                  </TableCell>
                  <TableCell>{x.stor_temp ?? ""}</TableCell>
                  <TableCell>{x.room_temp ?? ""}</TableCell>
                  <TableCell>{x.stor_humi ?? ""}</TableCell>
                  <TableCell>{x.duration ?? ""}</TableCell>
                  <TableCell className="max-w-70 truncate">
                    {x.remarks ?? ""}
                  </TableCell>
  
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

                // <TableCell className="text-right">
                //     <div className="flex justify-end gap-2">
                //       {/* If you want Edit, tell me and I’ll add /[id]/page.tsx */}
                //       <Button
                //         size="sm"
                //         variant="destructive"
                //         onClick={() => onDelete(x.id)}
                //       >
                //         Delete
                //       </Button>
                //     </div>
                //   </TableCell>