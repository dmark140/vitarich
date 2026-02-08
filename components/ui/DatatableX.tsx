// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// "use client"

// import * as React from "react"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { ColumnDef } from "@tanstack/react-table"
// import { ChevronDown, ChevronUp } from "lucide-react"
// import { formatCurrency } from "./utils"
// import { Skeleton } from "@/components/ui/skeleton"

// // --------------------
// // Types
// // --------------------
// type BaseTableProps<TData, TValue> = {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
//   type?: string
//   loading?: boolean
//   onClick?: (value: any) => void
//   totalCount?: number
//   searchable?: boolean // ✅ NEW
// }
// type WithOptions<TData, TValue> = {
//   hideOption?: false
//   page: number
//   limit: number
//   onPageChange: (page: number) => void
//   onLimitChange: (limit: number) => void
// }
// type WithoutOptions<TData, TValue> = {
//   hideOption: true
//   page?: never
//   limit?: never
//   onPageChange?: never
//   onLimitChange?: never
// }

// type DataTableProps<TData, TValue> =
//   BaseTableProps<TData, TValue> &
//   (WithOptions<TData, TValue> | WithoutOptions<TData, TValue>)

// // --------------------
// // Component
// // --------------------
// export function DataTableX<TData, TValue>({
//   columns,
//   data,
//   loading,
//   onClick,
//   page,
//   limit,
//   onPageChange,
//   onLimitChange,
//   totalCount,
//   hideOption,
//   searchable,
// }: DataTableProps<TData, TValue>) {
//   const [sortKey, setSortKey] = React.useState<string | null>(null)
//   const [sortAsc, setSortAsc] = React.useState(true)

//   const [selectedRow, setSelectedRow] = React.useState<number | null>(null)

//   const [filters, setFilters] = React.useState<Record<string, string>>({})

//   React.useEffect(() => {
//     setSelectedRow(null)
//     console.log("data changed")
//     console.log({ data })
//   }, [data])

//   const getColumnKey = (col: ColumnDef<TData, TValue>): string => {
//     if ("accessorKey" in col && typeof (col as any).accessorKey === "string") {
//       return (col as any).accessorKey as string
//     }
//     if (typeof col.id === "string") return col.id
//     return ""
//   }

//   const filteredData = React.useMemo(() => {
//     if (!searchable) return data
//     if (data)
//       return data.filter((row: any) =>
//         Object.entries(filters).every(([key, value]) => {
//           if (!value) return true
//           const cellValue = row?.[key]
//           return String(cellValue ?? "")
//             .toLowerCase()
//             .includes(value.toLowerCase())
//         })
//       )
//   }, [data, filters, searchable])

//   const sortedData = React.useMemo(() => {
//     if (!sortKey) return filteredData
//     return [...filteredData].sort((a: any, b: any) => {
//       const av = a?.[sortKey]
//       const bv = b?.[sortKey]
//       if (av == null && bv == null) return 0
//       if (av == null) return sortAsc ? -1 : 1
//       if (bv == null) return sortAsc ? 1 : -1
//       if (typeof av === "string" && typeof bv === "string") {
//         return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
//       }
//       if (av < bv) return sortAsc ? -1 : 1
//       if (av > bv) return sortAsc ? 1 : -1
//       return 0
//     })
//   }, [filteredData, sortKey, sortAsc])

//   const handleSort = (key: string) => {
//     if (!key) return
//     if (sortKey === key) {
//       setSortAsc((s) => !s)
//     } else {
//       setSortKey(key)
//       setSortAsc(true)
//     }
//   }

//   const renderHeader = (col: ColumnDef<TData, TValue>) => {
//     const key = getColumnKey(col)
//     const h = col.header as unknown
//     if (typeof h === "function") {
//       return (h as any)({ column: { id: key } })
//     }
//     return (h as React.ReactNode) ?? key
//   }

//   const renderCell = (col: ColumnDef<TData, TValue>, row: TData) => {
//     const key = getColumnKey(col)
//     const c = col.cell as unknown
//     if (typeof c === "function") {
//       return (c as any)({
//         row: { original: row },
//         getValue: () => (row as any)?.[key],
//       })
//     }
//     if (c !== undefined) return c as React.ReactNode
//     return (row as any)?.[key] as React.ReactNode
//   }

//   const pageCount =
//     !hideOption && totalCount
//       ? Math.max(1, Math.ceil(totalCount / (limit as number)))
//       : 1

//   return (
//     <div className="w-full">
//       <Table className="border">
//         <TableHeader className="border ">
//           <TableRow className="rounded-md hover:bg-muted/50  p-0 m-0 transition-colors border">
//             {columns.map((col, idx) => {
//               const key = getColumnKey(col) || `col-${idx}`
//               return (
//                 <TableHead
//                   className=""
//                   key={key}
//                   onClick={() => handleSort(getColumnKey(col))}
//                 // className="transition-colors bg-muted first:rounded-l-xl last:rounded-r-xl h-[34px] hover:cursor-pointer font-semibold"
//                 >
//                   <div className="flex justify-items-center">
//                     {renderHeader(col)}
//                     <span className="-mt-0.5 text-accent-foreground">
//                       {sortAsc ? (
//                         <ChevronUp
//                           className={`${sortKey != getColumnKey(col) ? "opacity-0" : ""
//                             }`}
//                         />
//                       ) : (
//                         <ChevronDown
//                           className={`${sortKey != getColumnKey(col) ? "opacity-0" : ""
//                             }`}
//                         />
//                       )}
//                     </span>
//                   </div>
//                 </TableHead>
//               )
//             })}
//           </TableRow>

//           {/* ✅ Search filter row */}
//           {searchable && (
//             <TableRow className="border">
//               {columns.map((col, ci) => {
//                 const key = getColumnKey(col) || `c-${ci}`
//                 return (
//                   <TableCell className="border p-0 m-0" key={key}>
//                     <Input

//                       // placeholder={`Search ${key}`}

//                       value={filters[key] ?? ""}
//                       onChange={(e) =>
//                         setFilters((prev) => ({
//                           ...prev,
//                           [key]: e.target.value,
//                         }))
//                       }
//                       className="h-6 p-0 m-0"
//                     />
//                   </TableCell>
//                 )
//               })}
//             </TableRow>
//           )}
//         </TableHeader>

//         <TableBody>
//           {!loading &&
//             sortedData?.map((row, i) => (
//               <TableRow
//                 key={i}
//                 onClick={() => {
//                   setSelectedRow(i)
//                   onClick?.(row)
//                 }}
//                 className={`cursor-pointer h-[28px] border transition-colors ${selectedRow === i ? " bg-muted" : "hover:bg-muted/50"
//                   }`}
//               >
//                 {columns.map((col, ci) => {
//                   const key = getColumnKey(col) || `c-${ci}`
//                   return (
//                     <TableCell key={key}
//                       // className={` ${ci == 0 && selectedRow === i ? "border " : ""}`}
//                       className="border"
//                     >
//                       <p
//                         className={`
//                            ${(col as any).meta?.css == "status"
//                             ? renderCell(col, row) == "Enabled"
//                               ? "bg-blue-700  rounded-md px-2  w-fit font-semibold    text-foreground"
//                               : renderCell(col, row) == "Disabled"
//                                 ? "bg-gray-700   rounded-md px-2  w-fit font-semibold    text-foreground"
//                                 : renderCell(col, row) == "Draft"
//                                   ? "bg-yellow-700   rounded-md px-2  w-fit font-semibold    text-foreground"
//                                   : ""
//                             : ""
//                           }`}
//                       >
//                         {(col as any).css == "currency"
//                           ? formatCurrency(renderCell(col, row))
//                           : renderCell(col, row)}
//                       </p>
//                     </TableCell>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           {loading && (
//             <TableRow>
//               {columns.map((_, ci) => (
//                 <TableCell key={ci}>
//                   <Skeleton className="w-full h-5" />
//                 </TableCell>
//               ))}
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       {!hideOption && (
//         <div className="flex items-center justify-between mt-2">
//           <div className="grid gap-2">
//             <span className="mx-4">
//               Page {page} of {pageCount}
//             </span>
//             <div className="flex mx-4">
//               {[10, 50, 100, 500].map((size) => (
//                 <Button
//                   key={size}
//                   onClick={() => onLimitChange(size)}
//                   variant={"secondary"}
//                   className={`rounded-none first:rounded-l-md last:rounded-r-md  
//                 ${limit === size ? " bg-background" : ""}`}
//                 >
//                   {size}
//                 </Button>
//               ))}
//             </div>
//           </div>
//           <div className="grid gap-2">
//             <span className="invisible">placeholder</span>
//             <div className="mx-4">
//               <Button
//                 variant={"secondary"}
//                 className="rounded-r-none"
//                 onClick={() => onPageChange(page > 1 ? page - 1 : 1)}
//                 disabled={page <= 1}
//               >
//                 Previous
//               </Button>
//               <Button
//                 variant={"secondary"}
//                 className="rounded-l-none"
//                 onClick={() => onPageChange(page < pageCount ? page + 1 : page)}
//                 disabled={page >= pageCount}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {data.length == 0 && <div className="text-muted-foreground mx-auto w-fit"> No data available in table</div>}

//     </div>
//   )
// }
