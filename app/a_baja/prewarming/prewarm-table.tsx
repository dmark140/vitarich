"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import { Search, Plus, RefreshCw } from "lucide-react"

import { EggPreWarmingRow, listPreWarmings } from "./new/api"

export default function PrewarmTable() {
  const [items, setItems] = useState<EggPreWarmingRow[]>([])
  const [sorting, setSorting] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [columnVisibility, setColumnVisibility] = useState<any>({})
  const [rowSelection, setRowSelection] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await listPreWarmings({ is_active: true, limit: 200 })
      setItems((Array.isArray(data) ? data : []) as EggPreWarmingRow[])
    } catch (e) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      router.prefetch("/a_baja/prewarming/new")
      await fetchData()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const columns: ColumnDef<EggPreWarmingRow>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "egg_ref_no",
      header: "Egg Reference No.",
    },
    {
      accessorKey: "pre_temp",
      header: "Pre-Warming Temp",
    },
    {
      accessorKey: "egg_temp",
      header: "Egg Shell Temp",
    },
    {
      accessorKey: "egg_temp_time_start",
      header: "Start Time",
    },
    {
      accessorKey: "egg_temp_time_end",
      header: "End Time",
    },
    {
      accessorKey: "duration",
      header: "Duration (minutes)",
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="rounded-md border p-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative w-72">
            <Input
              placeholder="Filter Egg Reference No."
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

          <Button
            type="button"
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="size-4" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/a_baja/prewarming/new")}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          New Record
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="whitespace-normal wrap-break-word text-center align-middle"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
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
