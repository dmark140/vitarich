"use client"
import SideBarMain from '@/components/ui/sidebar/SideBarMain'
import { useState, useEffect } from "react";
import HatchFormModal from "./HatchFormModal";
import { createHatch, getHatches } from "./api"; 
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender, // Add this import
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { HatchClassification } from "@/lib/types";
import { Filter, Pencil, Plus, RefreshCwIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

function TableActions({ item, onEdit }: { item: HatchClassification; onEdit: (item: HatchClassification) => void }) {
  return (
    <Button  
      type="button"
      size="sm"
      variant="outline"
      onClick={() => onEdit(item)}
    > 
      <Pencil className="w-4 h-4 mr-2" />
       
    </Button>
  );
}
 
export default function page() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<HatchClassification[]>([]);
  const [selectedItem, setSelectedItem] = useState<HatchClassification | null>(null);
  const [sorting, setSorting] = useState<any>([]);
  const [columnFilters, setColumnFilters] = useState<any>([]);
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [rowSelection, setRowSelection] = useState<any>({});
  const Router = useRouter();

  useEffect(() => {
    (async () => {
      Router.prefetch('/a_baja/hatcheryclassi/new');
      const data = await getHatches();
      if (data && !Array.isArray(data) || (Array.isArray(data) && data.length > 0 && 'error' in data[0])) {
        setItems([]);
      } else {
        setItems((Array.isArray(data) ? data : []) as unknown as HatchClassification[]);
      }
    })();
  }, []);
  
  const handleEdit = (item: HatchClassification) => {
    if (selectedItem?.id === item.id && open) {
      setOpen(false);
      return;
    }
    
    setSelectedItem(item);
    setOpen(true);
  };

  const columns: ColumnDef<HatchClassification>[] = [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "daterec",
      header: "Date Recorded",
    },
    {
      accessorKey: "br_no",
      header: "Breeder Ref. No.",
    },
    {
      accessorKey: "ttl_count",
      header: "Total Count",
    },
     {
      accessorKey: "sStus",
      header: "Status",
    },
    {
      id: "actions",
      header: "Classify",
      cell: ({ row }) => <TableActions item={row.original} onEdit={handleEdit} />,
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
    <div>
      <SideBarMain currentLabel='Hatchery Classification' fatherLink='./' fatherLabel='Hatchery'>
      <form action="" className="upper">
        <div className="mb-4 flex justify-between">
          <div></div>
          <div className="flex items-center gap-2 mt-4"> 
          </div>
        </div>

        {/* <Separator className="border my-4" /> */}

        {/* ✅ DATA TABLE SECTION */}
        <div className="rounded-md border p-3">          {/* Filter Input */} 
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Input
                placeholder="Filter Breeder Ref. No."
                // value={Filter}
                // onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-2 py-2 w-full"
              />
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button>
              Search
            </Button>
              <Button
                type="button"
                className="mr-4 flex items-center"
                onClick={() => {
                Router.push('/a_baja/hatcheryclassi/new');
                }}
              >
                <Plus className="size-4" /> New Classification
              </Button>
          </div>

          {/* Data Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
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

          {/* Pagination Controls */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                type="button"
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
      </form>

        {/* <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.map((row) => (
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
            ))}
          </TableBody>
        </Table> */}

        <HatchFormModal
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={async (data) => {
            await createHatch(data);
          }}
        />
      </SideBarMain>
    </div>
  );
}