// app/a_baja/chickpullout/chickpullout-table.tsx
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

import { ChickPulloutProcess, listChickPulloutProcess, deleteChickPulloutProcess } from "./new/api"

export default function ChickPulloutTable() {
  const router = useRouter()
  const [items, setItems] = useState<ChickPulloutProcess[]>([])
  const [globalFilter, setGlobalFilter] = useState("")

  async function load() {
    const data = await listChickPulloutProcess()
    setItems(data)
  }

  useEffect(() => {
    load().catch(console.error)
  }, [])

  async function onDelete(id: number) {
    if (!confirm("Delete this record?")) return
    await deleteChickPulloutProcess(id)
    await load()
    router.refresh()
  }

  const columns = useMemo<ColumnDef<ChickPulloutProcess>[]>(
    () => [
      {
        accessorKey: "egg_ref_no",
        header: "Egg Ref. No.",
      },
      {
        accessorKey: "chick_hatch_ref_no",
        header: "Chick Hatch Ref. No.",
      },
      {
        accessorKey: "farm_source",
        header: "Farm Source",
      },
      {
        accessorKey: "machine_no",
        header: "Machine",
      },
      {
        accessorKey: "hatch_date",
        header: "Hatch Date",
      },
      {
        accessorKey: "chicks_hatched",
        header: "Chicks Hatched",
        cell: ({ row }) => row.original.chicks_hatched ?? "",
      },
      {
        accessorKey: "dead_in_shell",
        header: "Dead-in-shell",
      },
      {
        accessorKey: "hatch_fertile",
        header: "Hatch of Fertile (%)",
      },
      {
        accessorKey: "mortality_rate",
        header: "Mortality Rate (%)",
      },
      {
        accessorKey: "hatch_window",
        header: "Hatch Window",
      },
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
                onClick={() => router.push(`/a_baja/chickpullout/new?id=${item.id}`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {/* <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(item.id)}
              >
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
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _colId, filterValue) => {
      const v = String(filterValue ?? "").toLowerCase()
      const hay = [
        row.original.egg_ref_no,
        row.original.chick_hatch_ref_no,
        row.original.farm_source,
        row.original.machine_no,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return hay.includes(v)
    },
  })

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
        <Input
            placeholder="Filter Egg Ref. No."
            className="pl-10"
            value={
            (table.getColumn("egg_ref_no")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
            table.getColumn("egg_ref_no")?.setFilterValue(e.target.value)
            }
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>


        <div className="flex gap-2">
          <Button variant="outline" onClick={() => load()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => router.push("/a_baja/chickpullout/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Chick Pullout
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="whitespace-normal wrap-break-word text-left align-middle">
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
