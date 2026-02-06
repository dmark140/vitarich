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
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    (async () => {
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
      header: "BREEDER REF. NO.",
    },
    {
      accessorKey: "br_no",
      header: "BREEDER REF. NO.",
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
        {/* <div className="mb-4">
          <button onClick={() => setOpen(true)}>Classify</button>
        </div> */}

        <Table>
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
        </Table>

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