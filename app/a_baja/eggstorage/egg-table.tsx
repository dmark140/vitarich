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
import { Search, Plus } from "lucide-react"

import { EggStorageMngt, listEggStorage } from "./new/api"

export default function EggTable() {
  const [items, setItems] = useState<EggStorageMngt[]>([])
  const [sorting, setSorting] = useState<any>([])
  const [columnFilters, setColumnFilters] = useState<any>([])
  const [columnVisibility, setColumnVisibility] = useState<any>({})
  const [rowSelection, setRowSelection] = useState<any>({})

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      router.prefetch("/a_baja/eggstorage/new")

      try {
        const data = await listEggStorage()

        if (
          (data && !Array.isArray(data)) ||
          (Array.isArray(data) && data.length > 0 && "error" in (data as any)[0])
        ) {
          setItems([])
        } else {
          setItems((Array.isArray(data) ? data : []) as EggStorageMngt[])
        }
      } catch {
        setItems([])
      }
    })()
  }, [router])

  const columns: ColumnDef<EggStorageMngt>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "stor_temp",
      header: "Storage Temperature",
    },
    {
      accessorKey: "room_temp",
      header: "Room Temperature",
    },
    {
      accessorKey: "stor_humi",
      header: "Storage Humidity",
    },
    {
      accessorKey: "shell_start",
      header: "Shell Temp Start",
      cell: ({ row }) => {
        const v = row.original.shell_start
        return v ? new Date(v).toLocaleString() : ""
      },
    },
    {
      accessorKey: "shell_end",
      header: "Shell Temp End",
      cell: ({ row }) => {
        const v = row.original.shell_end
        return v ? new Date(v).toLocaleString() : ""
      },
    },
    {
      accessorKey: "duration",
      header: "Duration (min)",
      cell: ({ row }) => row.original.duration ?? "",
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
              placeholder="Filter Remarks"
              className="pl-10"
              value={
                (table.getColumn("remarks")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("remarks")?.setFilterValue(e.target.value)
              }
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/a_baja/eggstorage/new")}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" /> Egg Storage
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
