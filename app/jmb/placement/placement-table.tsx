"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnFiltersState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Breadcrumb from "@/lib/Breadcrumb";
import EditActionButton from "@/components/EditActionButton";
import { refreshSessionx } from "@/app/admin/user/RefreshSession";
import { useGlobalContext } from "@/lib/context/GlobalContext";
import { useConfirm, withConfirmProvider } from "@/lib/ConfirmProvider";
import { deletePlacement, listPlacements, type Placement } from "./new/api";

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-CA");
}

function formatNumber(value?: number | null) {
  if (value == null || !Number.isFinite(Number(value))) return "";
  return Number(value).toLocaleString();
}

function PlacementTableInner() {
  const router = useRouter();
  const confirm = useConfirm();
  const { setValue } = useGlobalContext();

  const [items, setItems] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  async function fetchData() {
    setLoading(true);
    try {
      const data = await listPlacements();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshSessionx(router);
  }, [router]);

  useEffect(() => {
    (async () => {
      router.prefetch("/jmb/placement/new");
      await fetchData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue("loading_g", loading);
  }, [loading, setValue]);

  async function handleDelete(row: Placement) {
    const approved = await confirm({
      title: "Delete placement record?",
      description: `This will permanently delete DR No. ${row.dr_no} / Pen ${row.pen_no}.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!approved) return;

    try {
      await deletePlacement(row.id);
      await fetchData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete placement.";
      alert(message);
    }
  }

  const columns: ColumnDef<Placement>[] = [
    {
      id: "row_no",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <EditActionButton
            id={row.original.id}
            href={(id) => `/jmb/placement/new?id=${id}`}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.original)}
            className="h-8 px-3 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "placement_date",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.placement_date),
    },
    {
      accessorKey: "dr_no",
      header: "DR No.",
    },
    {
      accessorKey: "building_no",
      header: "Building",
    },
    {
      accessorKey: "pen_no",
      header: "Pen",
    },
    {
      accessorKey: "f_beg",
      header: "F Placement",
      cell: ({ row }) => formatNumber(row.original.f_beg),
    },
    {
      accessorKey: "f_doa",
      header: "F DOA",
      cell: ({ row }) => formatNumber(row.original.f_doa),
    },
    {
      accessorKey: "f_reject",
      header: "F Reject",
      cell: ({ row }) => formatNumber(row.original.f_reject),
    },
    {
      accessorKey: "f_shortcount",
      header: "F Short Count",
      cell: ({ row }) => formatNumber(row.original.f_shortcount),
    },
    {
      accessorKey: "f_endingbalance",
      header: "F Ending Balance",
      cell: ({ row }) => formatNumber(row.original.f_endingbalance),
    },
    {
      accessorKey: "m_beg",
      header: "M Placement",
      cell: ({ row }) => formatNumber(row.original.m_beg),
    },
    {
      accessorKey: "m_doa",
      header: "M DOA",
      cell: ({ row }) => formatNumber(row.original.m_doa),
    },
    {
      accessorKey: "m_reject",
      header: "M Reject",
      cell: ({ row }) => formatNumber(row.original.m_reject),
    },
    {
      accessorKey: "m_shortcount",
      header: "M Short Count",
      cell: ({ row }) => formatNumber(row.original.m_shortcount),
    },
    {
      accessorKey: "m_endingbalance",
      header: "M Ending Balance",
      cell: ({ row }) => formatNumber(row.original.m_endingbalance),
    },
    {
      accessorKey: "remarks",
      header: "remarks",
      cell: ({ row }) => row.original.remarks ?? "",
    },
  ];

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
  });

  return (
    <div className="rounded-md p-4 mt-4">
      <Breadcrumb
        SecondPreviewPageName="Breeder"
        CurrentPageName="Placement List"
      />
      <br />

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Input
              placeholder="Filter DR Number"
              className="pl-10"
              value={
                (table.getColumn("dr_no")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("dr_no")?.setFilterValue(e.target.value)
              }
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={fetchData}
            disabled={loading}
            className="flex h-full w-full items-center gap-2 md:h-auto md:w-auto"
          >
            <RefreshCw className="size-4" />
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/jmb/placement/new")}
          className="flex h-full w-full items-center gap-2 md:h-auto md:w-auto"
        >
          <Plus className="size-4" />
          New Record
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-normal text-left align-middle"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
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
    </div>
  );
}

export default withConfirmProvider(PlacementTableInner);
