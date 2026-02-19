'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  approveHatcheryDraft,
  getHatcheryDraftItems,
  rejectHatcheryDraft
} from './api'
import { DataRecordApproval } from '@/lib/types'
import { today } from '@/lib/Defaults/DefaultValues'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/lib/Breadcrumb'
import SearchableDropdown from '@/lib/SearchableDropdown'
import { toast } from 'sonner'

type DraftItem = {
  id: number
  brdr_ref_no: string
  sku: string
  UoM: string
  lot_no?: string
  breed?: string
  prod_date?: string
  age?: string
  house_no?: string
  jr?: number
  he?: number
  actual_jr?: number
  actual_he?: number
  expected_count: number
  actual_count?: number
  isNew?: boolean
}

type ItemMasterType = {
  id: number
  item_code: string
  item_name: string
  unit_measure: string
}

export default function ApprovalDecisionForm() {
  const { getValue, setValue } = useGlobalContext()
  const route = useRouter()

  const [header, setHeader] = useState<DataRecordApproval | null>(null)
  const [items, setItems] = useState<DraftItem[]>([])
  const [ItemMaster, setItemMaster] = useState<ItemMasterType[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const [postingDate, setPostingDate] = useState(today)
  const [temperature, setTemperature] = useState('')
  const [humidity, sethumidity] = useState('')

  const [footer, setFooter] = useState({
    crates: '',
    trays: '',
    van_plate: '',
    driver: '',
    serial: ''
  })

  useEffect(() => {
    const init = async () => {
      setItemMaster(await getValue("itemmaster") || [])
      route.prefetch("/a_dean/receiving")

      const ctx = getValue('forApproval')
      if (!ctx?.row) return route.push("/a_dean/receiving")

      setHeader(ctx.row)
      setPostingDate(ctx.row.posting_date || today)
    }
    init()
  }, [getValue])

  useEffect(() => {
    if (!header?.docentry) return
    // console.log({ header })
    getHatcheryDraftItems(Number(header.docentry)).then(({ data }) => {
      // console.log({ data })
      if (!data) return
      setItems(data.map((i: DraftItem) => ({
        ...i,
        actual_jr: 0,
        actual_he: 0,
        actual_count: undefined,
        isNew: false,
      })))
    })
  }, [header])

  const breederOptions = useMemo(
    () => [...new Set(items.map(i => i.brdr_ref_no).filter(Boolean))]
      .map(ref => ({ code: ref })),
    [items]
  )

  const updateItem = (id: number, changes: Partial<DraftItem>) =>
    setItems(p => p.map(i => i.id === id ? { ...i, ...changes } : i))

  const addRow = () => setItems(p => [
    ...p,
    {
      id: Date.now(),
      brdr_ref_no: '',
      sku: '',
      UoM: 'PCS',
      expected_count: 0,
      actual_jr: 0,
      actual_he: 0,
      isNew: true,
    },
  ])

  const toggleRow = (id: number) => {
    const item = items.find(i => i.id === id)
    if (!item?.isNew) return

    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  const removeSelectedRows = () => {
    setItems(p => p.filter(i => !(i.isNew && selectedRows.includes(i.id))))
    setSelectedRows([])
  }

  // const approveDocument = async () => {
  //   if (!header?.docentry) return

  //   const res = await approveHatcheryDraft({
  //     docentry: Number(header.docentry),
  //     posting_date: postingDate,
  //     temperature,
  //     footer,
  //     items
  //   })

  //   if (!res.success) return toast(res.error)

  //   setValue("forApproval", [])
  //   toast('Document approved')
  //   route.push("/a_dean/receiving")
  // }

  // const approveDocument = async () => {
  //   if (!header?.docentry) return

  //   if (!temperature) return toast('Temperature is required')
  //   if (!humidity) return toast('Humidity is required')

  //   if (items.length === 0)
  //     return toast('No line items')

  //   // Ensure every item has actual_count
  //   const normalizedItems = items.map(i => ({
  //     ...i,
  //     actual_count:
  //       i.actual_count ??
  //       ((i.actual_jr || 0) + (i.actual_he || 0))
  //   }))

  //   const res = await approveHatcheryDraft({
  //     docentry: Number(header.docentry),

  //     // HEADER
  //     posting_date: postingDate,
  //     temperature,
  //     humidity,

  //     soldTo: header.soldTo || '',
  //     Attention: header.Attention || '',
  //     po_no: header.po_no || '',
  //     voyage_no: header.voyage_no || '',
  //     shipped_via: header.shipped_via || '',
  //     dr_num: header.dr_num || '',

  //     // FOOTER
  //     no_of_crates: footer.crates || '',
  //     no_of_tray: footer.trays || '',
  //     plate_no: footer.van_plate || '',
  //     driver: footer.driver || '',
  //     serial_no: footer.serial || '',

  //     // LINE ITEMS
  //     items: normalizedItems,
  //   })

  //   if (!res.success) return toast(res.error)

  //   setValue("forApproval", [])
  //   toast('Document received successfully')
  //   route.push("/a_dean/receiving")
  // }
  const approveDocument = async () => {
    if (!header?.docentry) return
    if (!items.length) {
      return { success: false, error: "No items provided." }
    }

    const payload = {
      docentry: Number(header.docentry),
      posting_date: postingDate,
      temperature,
      humidity,

      soldTo: header.soldTo || '',
      Attention: header.Attention || '',
      po_no: header.po_no || '',
      voyage_no: header.voyage_no || '',
      shipped_via: header.shipped_via || '',
      dr_num: header.dr_num || '',

      no_of_crates: footer.crates || '',
      no_of_tray: footer.trays || '',
      plate_no: footer.van_plate || '',
      driver: footer.driver || '',
      serial_no: footer.serial || '',

      items: items.map(i => ({
        brdr_ref_no: i.brdr_ref_no || '',
        sku: i.sku || '',
        UoM: i.UoM || '',
        lot_no: i.lot_no || '',
        prod_date: i.prod_date || '',
        age: i.age || '',
        house_no: i.house_no || '',
        jr: i.jr ?? 0,
        he: i.he ?? 0,
        expected_count: i.expected_count ?? 0,
        actual_count:
          i.actual_count ??
          ((i.actual_jr || 0) + (i.actual_he || 0))
      })),
    }

    const res = await approveHatcheryDraft(payload)

    if (!res.success) return toast(res.error)

    setValue("forApproval", [])
    toast('Document approved')
    route.push("/a_dean/receiving")
  }


  const rejectDocument = async () => {
    if (!header?.uid) return
    const res = await rejectHatcheryDraft(Number(header.uid), 'Rejected')
    if (!res.success) return toast(res.error)

    toast('Document rejected')
    route.push("/a_dean/receiving")
  }

  if (!header) return null



  const headerFields = [
    {
      label: 'Sold To',
      value: header?.soldTo || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, soldTo: v } : h),
    },
    {
      label: 'Date', type: 'date',
      value: header?.doc_date || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, doc_date: v } : h),
    },
    {
      label: 'Posting Date', type: 'date',
      value: postingDate,
      onChange: setPostingDate,
    },

    {
      label: 'Address',
      value: header?.address || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, address: v } : h),
    },
    {
      label: 'P.O No',
      value: header?.po_no || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, po_no: v } : h),
    },
    {
      label: 'DR No',
      value: header?.dr_num || '',
      readOnly: true,
    },

    {
      label: 'Attention To',
      value: header?.Attention || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, Attention: v } : h),
    },
    {
      label: 'Voyage No',
      value: header?.voyage_no || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, voyage_no: v } : h),
    },
    {
      label: 'Temperature',
      value: temperature,
      onChange: setTemperature,
    }, {
      label: 'Humidity',
      value: humidity,
      onChange: sethumidity,
    },

    {
      label: 'Tin',
      value: header?.tin || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, tin: v } : h),
    },
    {
      label: 'Shipped Via',
      value: header?.shipped_via || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, shipped_via: v } : h),
    },
    {
      label: 'Shipped To',
      value: header?.shipped_to || '',
      onChange: (v: string) => setHeader(h => h ? { ...h, shipped_to: v } : h),
    },
  ]


  return (
    <Card className="w-full border-none shadow-none bg-background p-0">
      <CardHeader className="border-b">
        <div className="flex justify-between">
          <Breadcrumb FirstPreviewsPageName='Hatchery' CurrentPageName='Receiving' />
          <div className="flex gap-3">
            <Button variant="destructive" onClick={rejectDocument}>Reject</Button>
            <Button onClick={approveDocument}>Receive</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='bg-white rounded-2xl p-4 space-y-6'>
        <div className="grid grid-cols-3 gap-6">
          {headerFields.map((field, i) => (
            <div key={i}>
              <Label>{field.label}</Label>

              <Input
                type={field.type || 'text'}
                value={field.value}
                readOnly={field.readOnly}
                onChange={
                  field.readOnly
                    ? undefined
                    : e => field.onChange?.(e.target.value)
                }
              />
            </div>
          ))}
        </div>


        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-green-700">Line Items</Label>
            <div className="flex gap-2">
              {selectedRows.length > 0 && (
                <Button variant="destructive" onClick={removeSelectedRows}>
                  Remove Selected
                </Button>
              )}
              <Button variant="outline" onClick={addRow}>Add Row</Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Line No</TableHead>
                  <TableHead>BREEDER REF. NO.</TableHead>
                  <TableHead>EGG SKU</TableHead>
                  <TableHead>UoM</TableHead>
                  <TableHead>Lot No.</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Production Date</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>House No.</TableHead>
                  <TableHead>JR</TableHead>
                  <TableHead>HE</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actual JR</TableHead>
                  <TableHead>Actual HE</TableHead>
                  <TableHead>Actual Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item, index) => {
                  const total = (item.jr || 0) + (item.he || 0)
                  const actualTotal = (item.actual_jr || 0) + (item.actual_he || 0)

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.isNew && (
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={() => toggleRow(item.id)}
                          />
                        )}
                      </TableCell>

                      <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        <SearchableDropdown
                          list={breederOptions}
                          codeLabel="code"
                          value={item.brdr_ref_no}
                          onChange={(val) => updateItem(item.id, { brdr_ref_no: val })}
                        />
                      </TableCell>

                      <TableCell>
                        <SearchableDropdown
                          list={ItemMaster}
                          codeLabel="item_code"
                          nameLabel="item_name"
                          value={item.sku}
                          onChange={(val, selected) =>
                            updateItem(item.id, {
                              sku: val,
                              UoM: selected.unit_measure || 'PCS'
                            })
                          }
                        />
                      </TableCell>

                      <TableCell>{item.UoM}</TableCell>
                      <TableCell><Input value={item.lot_no || ''} onChange={e => updateItem(item.id, { lot_no: e.target.value })} /></TableCell>
                      <TableCell><Input value={item.breed || ''} onChange={e => updateItem(item.id, { breed: e.target.value })} /></TableCell>
                      <TableCell><Input type="date" value={item.prod_date || ''} onChange={e => updateItem(item.id, { prod_date: e.target.value })} /></TableCell>
                      <TableCell><Input value={item.age || ''} onChange={e => updateItem(item.id, { age: e.target.value })} /></TableCell>
                      <TableCell><Input value={item.house_no || ''} onChange={e => updateItem(item.id, { house_no: e.target.value })} /></TableCell>

                      <TableCell><Input type="number" value={item.jr || 0} readOnly /></TableCell>
                      <TableCell><Input type="number" value={item.he || 0} readOnly /></TableCell>
                      <TableCell><Input type="number" value={total} readOnly /></TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={item.actual_jr ?? 0}
                          onChange={e =>
                            updateItem(item.id, { actual_jr: Number(e.target.value) })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={item.actual_he ?? 0}
                          onChange={e =>
                            updateItem(item.id, { actual_he: Number(e.target.value) })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {item.isNew ? (
                          <Input
                            type="number"
                            value={
                              item.actual_count ??
                              ((item.actual_jr || 0) + (item.actual_he || 0))
                            }
                            onChange={e =>
                              updateItem(item.id, {
                                actual_count: Number(e.target.value) || 0
                              })
                            }
                          />
                        ) : (
                          <Input
                            type="number"
                            value={(item.actual_jr || 0) + (item.actual_he || 0)}
                            readOnly
                          />
                        )}
                      </TableCell>

                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div><Label>No Of Crates</Label><Input value={footer.crates} onChange={e => setFooter(f => ({ ...f, crates: e.target.value }))} /></div>
          <div><Label>No. of Tray</Label><Input value={footer.trays} onChange={e => setFooter(f => ({ ...f, trays: e.target.value }))} /></div>
          <div><Label>Van Plate No.</Label><Input value={footer.van_plate} onChange={e => setFooter(f => ({ ...f, van_plate: e.target.value }))} /></div>
          <div><Label>Driver</Label><Input value={footer.driver} onChange={e => setFooter(f => ({ ...f, driver: e.target.value }))} /></div>
          <div><Label>Serial Number</Label><Input value={footer.serial} onChange={e => setFooter(f => ({ ...f, serial: e.target.value }))} /></div>
        </div>

      </CardContent>
    </Card>
  )
}
