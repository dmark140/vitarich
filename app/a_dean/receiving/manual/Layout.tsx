'use client'
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataRecordApproval, DataTableColumn, DefaultFarm, DraftItem } from '@/lib/types'
import { today } from '@/lib/Defaults/DefaultValues'
import Breadcrumb from '@/lib/Breadcrumb'
import SearchableDropdown from '@/lib/SearchableDropdown'
import { createReceiving, getUserInfo } from './api'
import { Plus, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

type ItemMasterType = {
  id: number
  item_code: string
  item_name: string
  unit_measure: string
}

const emptyApprovalRecord: DataRecordApproval = {
  uid: 0,
  id: '',
  posting_date: today,
  email: '',
  soldTo: '',
  doc_date: today,
  address: '',
  tin: '',
  shipped_via: '',
  shipped_to: '',
  dr_num: '',
  po_no: '',
  Attention: '',
  voyage_no: '',
  status: 'pending',
  checked: false,
  docentry: 0,
  delivered_to: ''
}

export default function ApprovalDecisionForm() {

  const router = useRouter()
  const { getValue } = useGlobalContext()

  const [farms, setfarms] = useState<DataTableColumn[]>([])
  const [header, setHeader] = useState<DataRecordApproval | null>(null)
  const [items, setItems] = useState<DraftItem[]>([])
  const [ItemMaster, setItemMaster] = useState<ItemMasterType[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const [postingDate, setPostingDate] = useState(today)
  const [temperature, setTemperature] = useState('')
  const [humidity, sethumidity] = useState('')
  const [defaultFarm, setdefaultFarm] = useState<DefaultFarm>()

  const [footer, setFooter] = useState({
    crates: '',
    trays: '',
    van_plate: '',
    driver: '',
    serial: ''
  })

  const getDefaultFarm = async () => {
    const data = await getUserInfo()
    setdefaultFarm(data[0])
    setHeader(h => h ? { ...h, delivered_to: data[0].code } : h)
  }

  useEffect(() => {
    getDefaultFarm()
  }, [])

  useEffect(() => {
    router.prefetch("/a_dean/receiving/")
    const init = () => {
      setItemMaster(getValue("itemmaster") || [])
      setfarms(getValue("getFarmDB_breeder") || [])

      setHeader(emptyApprovalRecord)
      setPostingDate(today)
    }
    init()
  }, [getValue])

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

  const headerFieldsLeft = [
    { required: true, disabled: false, code: "", label: 'Deliver Date', type: 'date', value: header?.doc_date || '', onChange: (v: string) => setHeader(h => h ? { ...h, doc_date: v } : h) },
    { required: true, disabled: false, code: "", label: 'Address', value: header?.address || '', onChange: (v: string) => setHeader(h => h ? { ...h, address: v } : h) },
    { required: true, disabled: false, code: "tin", label: 'Tin', value: header?.tin || '', onChange: (v: string) => setHeader(h => h ? { ...h, tin: v } : h) },
  ]

  const headerFieldsRight = [
    { disabled: true, code: "", label: 'Delivered To', type: 'text', value: defaultFarm?.code + ' - ' + defaultFarm?.name, onChange: setPostingDate },
    { required: true, disabled: false, code: "", label: 'Posting Date', type: 'date', value: postingDate, onChange: setPostingDate },
    { required: true, disabled: false, code: "", label: 'P.O No', value: header?.po_no || '', onChange: (v: string) => setHeader(h => h ? { ...h, po_no: v } : h) },
    { required: true, disabled: false, code: "", label: 'DR No', value: header?.dr_num || '', onChange: (v: string) => setHeader(h => h ? { ...h, dr_num: v } : h) },
    { required: true, disabled: false, code: "", label: 'Attention To', value: header?.Attention || '', onChange: (v: string) => setHeader(h => h ? { ...h, Attention: v } : h) },
    { required: true, disabled: false, code: "", label: 'Voyage No', value: header?.voyage_no || '', onChange: (v: string) => setHeader(h => h ? { ...h, voyage_no: v } : h) },
    { required: true, disabled: false, code: "", label: 'Temperature', type: 'number', value: temperature, onChange: setTemperature },
    { required: true, disabled: false, code: "", label: 'Humidity', type: 'number', value: humidity, onChange: sethumidity },
    { required: true, disabled: false, code: "", label: 'Shipped Via', value: header?.shipped_via || '', onChange: (v: string) => setHeader(h => h ? { ...h, shipped_via: v } : h) },
    { required: true, disabled: false, code: "", label: 'Shipped To', value: header?.shipped_to || '', onChange: (v: string) => setHeader(h => h ? { ...h, shipped_to: v } : h) },
  ]

  const validateLineItems = () => {

    if (items.length === 0) {
      alert("Add at least one line item")
      return false
    }

    for (const row of items) {

      if (
        !row.brdr_ref_no ||
        !row.sku ||
        !row.lot_no ||
        !row.breed ||
        !row.prod_date ||
        !row.age ||
        !row.house_no ||
        row.actual_total === undefined
      ) {
        alert("All line item fields are required.")
        return false
      }
    }

    return true
  }

  const insertMe = async () => {

    const transformedItems = items.map(i => ({
      ...i,
      total_api: i.total ?? 0,
      actual_count: i.actual_total ?? 0,
    }))

    const payload = {
      doc_date: header?.doc_date,
      temperature,
      humidity,
      soldTo: header?.soldTo,
      Attention: header?.Attention,
      po_no: header?.po_no,
      voyage_no: header?.voyage_no,
      shipped_via: header?.shipped_via,
      dr_num: header?.dr_num,
      no_of_crates: footer.crates,
      no_of_tray: footer.trays,
      plate_no: footer.van_plate,
      driver: footer.driver,
      serial_no: footer.serial,
      delivered_to: defaultFarm?.code,
      items: transformedItems,
    }

    const res = await createReceiving(payload)
    router.push("/a_dean/receiving/")

    if (res.success) {
      alert(`Saved! DocEntry: ${res.docentry}`)
    } else {
      alert(res.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLineItems()) return

    await insertMe()
  }

  return (

    <form onSubmit={handleSubmit}>

      <Card className="w-full border-none shadow-none bg-background p-0">

        <CardHeader className="border-b">

          <div className="flex justify-between items-center">

            <div className='mt-8'>
              <Breadcrumb
                FirstPreviewsPageName='Receiving'
                SecondPreviewPageName='Hatchery'
                CurrentPageName='Manual Receiving'
              />
            </div>

            <Button type="submit">
              <Save /> Save Record
            </Button>

          </div>

        </CardHeader>

        <CardContent className='bg-white rounded-2xl p-4 space-y-6'>

          <div className="sm:grid md:grid-cols-3 sm:grid-cools-2 gap-6">

            <div className='mt-2'>
              <Label className='pb-2'>Delivered From</Label>
              <SearchableDropdown
                list={farms}
                codeLabel="code"
                nameLabel="name"
                value={header?.soldTo || ''}
                onChange={(val) =>
                  setHeader(h => h ? { ...h, soldTo: val } : h)
                }
              />
            </div>

            {headerFieldsLeft.map((field, i) => (

              <div key={i} className='mt-1'>

                <Label className='pb-2 mt-1'>{field.label}</Label>

                <Input
                  required={field.required}
                  disabled={field.disabled}
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={e => field.onChange?.(e.target.value)}
                />

              </div>

            ))}

          </div>

          <Separator className='my-2' />

          <div className="sm:grid md:grid-cols-3 sm:grid-cools-2 gap-6">

            {headerFieldsRight.map((field, i) => (

              <div key={i} className='mt-1'>

                <Label className='pb-2 mt-1'>{field.label}</Label>

                <Input
                  required={field.required}
                  disabled={field.disabled}
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={e => field.onChange?.(e.target.value)}
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

                <Button type="button" onClick={addRow}>
                  <Plus />
                  Add Row
                </Button>

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
                    <TableHead>Total</TableHead>
                    <TableHead>Actual Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>

                  {items.map((item, index) => (

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
                        <Input
                          required
                          value={item.brdr_ref_no || ''}
                          onChange={e =>
                            updateItem(item.id, { brdr_ref_no: e.target.value })
                          }
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

                      <TableCell>
                        <Input
                          required
                          value={item.lot_no || ''}
                          onChange={e =>
                            updateItem(item.id, { lot_no: e.target.value })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          required
                          value={item.breed || ''}
                          onChange={e =>
                            updateItem(item.id, { breed: e.target.value })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          required
                          type="date"
                          value={item.prod_date || ''}
                          onChange={e =>
                            updateItem(item.id, { prod_date: e.target.value })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          required
                          value={item.age || ''}
                          onChange={e =>
                            updateItem(item.id, { age: e.target.value })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          required
                          value={item.house_no || ''}
                          onChange={e =>
                            updateItem(item.id, { house_no: e.target.value })
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          type="number"
                          value={item.total ?? 0}
                          readOnly
                          disabled
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          required
                          type="number"
                          value={item.actual_total ?? 0}
                          onChange={e =>
                            updateItem(item.id, {
                              actual_total: Number(e.target.value)
                            })
                          }
                        />
                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

          </div>

          <div className="grid grid-cols-5 gap-6">

            <div>
              <Label className='pb-2'>No Of Crates</Label>
              <Input
                required
                value={footer.crates}
                onChange={e => setFooter(f => ({ ...f, crates: e.target.value }))}
              />
            </div>

            <div>
              <Label className='pb-2'>No. of Tray</Label>
              <Input
                required
                value={footer.trays}
                onChange={e => setFooter(f => ({ ...f, trays: e.target.value }))}
              />
            </div>

            <div>
              <Label className='pb-2'>Van Plate No.</Label>
              <Input
                required
                value={footer.van_plate}
                onChange={e => setFooter(f => ({ ...f, van_plate: e.target.value }))}
              />
            </div>

            <div>
              <Label className='pb-2'>Driver</Label>
              <Input
                required
                value={footer.driver}
                onChange={e => setFooter(f => ({ ...f, driver: e.target.value }))}
              />
            </div>

            <div>
              <Label className='pb-2'>Serial Number</Label>
              <Input
                required
                value={footer.serial}
                onChange={e => setFooter(f => ({ ...f, serial: e.target.value }))}
              />
            </div>

          </div>

        </CardContent>

      </Card>

    </form>

  )
}