"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table"

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Plus, RefreshCw, Trash2, Search } from "lucide-react"

import { ChickGradingProcess, deleteChickGradingProcess, listChickGradingProcess } from "./new/api"

function fmtDateTime(v: string | null | undefined) {
  if (!v) return ""
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`
}

export default function ChickgradingTable() {
  const router = useRouter()
  const [items, setItems] = useState<ChickGradingProcess[]>([])
  const [columnFilters, setColumnFilters] = useState<any>([])

  async function load() {
    const data = await listChickGradingProcess()
    setItems(data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  async function onDelete(id: number) {
    if (!confirm("Delete this record?")) return
    await deleteChickGradingProcess(id)
    await load()
    router.refresh()
  }

  const columns = useMemo<ColumnDef<ChickGradingProcess>[]>(
    () => [
      { accessorKey: "egg_ref_no", header: "Filter Egg Ref. No." },
      { accessorKey: "batch_code", header: "Batch code" },
      { accessorKey: "grading_datetime", header: "Grading date & time",cell: ({ row }) => fmtDateTime(row.original.grading_datetime), },
      { accessorKey: "total_chicks", header: "Total chicks" },
      { accessorKey: "good_quality_chicks", header: "Good quality chicks" },
      { accessorKey: "quality_grade_rate", header: "Quality grade rate %" },
      { accessorKey: "cull_rate", header: "Cull rate %" },
      { accessorKey: "grading_personnel", header: "Grading personnel" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/a_baja/chickgrading/new?id=${item.id}`)}
              >
                <Pencil className="h-4 w-4" />Edit
              </Button>
              {/* <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button> */}
            </div>
          )
        },
      },
    ],
    [router]
  )

  const table = useReactTable({
    data: items,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between gap-2">
        {/* Filter like your egg-table */}
        <div className="relative w-72">
          <Input
            placeholder="Filter Egg Ref. No."
            className="pl-10"
            value={(table.getColumn("egg_ref_no")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("egg_ref_no")?.setFilterValue(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => load()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button onClick={() => router.push("/a_baja/chickgrading/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Check Grading
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="whitespace-nowrap">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((r) => (
                <TableRow key={r.id}>
                  {r.getVisibleCells().map((c) => (
                    <TableCell key={c.id}>
                      {c.column.columnDef.cell
                        ? flexRender(c.column.columnDef.cell, c.getContext())
                        : String(c.getValue() ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
