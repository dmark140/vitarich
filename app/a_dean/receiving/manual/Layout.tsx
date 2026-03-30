/**
 * @fileoverview Manual egg receiving form component for hatchery operations.
 * Handles the creation of receiving records with header information (delivery details, dates)
 * and line items (egg inventory details with production dates and batch information).
 * 
 * @module /app/a_dean/receiving/manual/Layout
 * @requires React, next/navigation, sonner (toast), custom hooks and components
 */
/**
 * Represents a single item from the item master database.
 * @typedef {Object} ItemMasterType
 * @property {number} id - Unique identifier
 * @property {string} item_code - SKU code for the egg item
 * @property {string} item_name - Display name of the egg item
 * @property {string} unit_measure - Unit of measurement (e.g., "PCS", "TRAY")
 */
/**
 * Parses an age string in format "X Weeks, Y Day(s)" into numeric components.
 * @description Extracts weeks and days from the standardized age format.
 * Used when toggling the age picker popover to restore previous values.
 * @param {string} ageString - Age string in format "26 Weeks, 0 Day(s)"
 * @returns {{w: number, d: number}} Object with weeks (w) and days (d)
 * @example
 * parseAge("26 Weeks, 3 Day(s)") // returns { w: 26, d: 3 }
 * parseAge("") // returns { w: 26, d: 0 } (default)
 */

/**
 * Fetches the default farm assigned to the current user.
 * 
 * @description Retrieves user information and sets the "delivered_to" field
 * in the header record. Called on component mount to populate farm details.
 * 
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If API call to getUserInfo fails
 * 
 * @side-effects Sets state: defaultFarm, header (delivered_to field)
 */

/**
 * Updates a single field in a line item by ID.
 * 
 * @description Immutably updates one or more properties of a draft item
 * in the items array. Used for form input changes in the table rows.
 * 
 * @param {number} id - The unique ID of the line item to update
 * @param {Partial<DraftItem>} changes - Object containing fields to update
 * @returns {void}
 * 
 * @example
 * updateItem(1234567890, { sku: "EGG-001", lot_no: "LOT-2024-01" })
 */

/**
 * Adds a new empty line item row to the items array.
 * 
 * @description Creates a draft item with default values. Used when user
 * clicks "Add Row" button. New items can be deleted unless saved.
 * 
 * @returns {void}
 * 
 * @side-effects Appends new DraftItem to items state with:
 * - Unique ID based on timestamp
 * - Default UoM: "PCS"
 * - Default age: "26 Weeks, 0 Day(s)"
 * - isNew flag: true (enables delete checkbox)
 */

/**
 * Toggles checkbox selection for a line item (new items only).
 * 
 * @description Allows users to select multiple new items for batch deletion.
 * Only affects items where isNew === true (unsaved draft items).
 * 
 * @param {number} id - The line item ID to toggle
 * @returns {void}
 * 
 * @side-effects Updates selectedRows state array
 */

/**
 * Removes all selected line items from the table.
 * 
 * @description Deletes items marked for removal (must be new/unsaved).
 * Clears the selection state after deletion.
 * 
 * @returns {void}
 * 
 * @side-effects Mutates items and selectedRows state
 */

/**
 * Validates all line items before submission.
 * 
 * @description Checks that:
 * - At least one line item exists
 * - Each item has required fields: brdr_ref_no, sku, lot_no, prod_date, age, house_no, actual_total
 * - A breed is selected in the header
 * 
 * Shows alert popup with missing fields if validation fails.
 * @returns {boolean} True if validation passes, false otherwise
 * 
 * @side-effects Displays toast notification if items array is empty
 */

/**
 * Submits the receiving record to the backend after confirmation.
 * 
 * @description Main form submission handler. Performs the following:
 * 1. Validates line items
 * 2. Shows confirmation dialog
 * 3. Transforms line items (auto-generates brdr_ref_no, converts totals)
 * 4. Calls createReceiving API with full payload
 * 5. Navigates to list page on success or shows error alert
 * 
 * @async
 * @returns {Promise<void>}
 * @throws Catches and displays errors via alert popup
 * 
 * @side-effects
 * - Sets loading state during submission
 * - Navigates router on success
 * - Displays alert dialogs for confirmation and results
 */

/**
 * Handles form submission with validation.
 * 
 * @description Prevents default form behavior and triggers insertMe
 * if line item validation passes.
 * 
 * @param {React.FormEvent} e - Form submission event
 * @returns {Promise<void>}
 */

/**
 * ApprovalDecisionForm Component
 * 
 * @description Main form component for recording manual egg receiving transactions.
 * Displays:
 * - Header section: delivery farm, dates, shipping info, breeder reference
 * - Line items table: egg inventory with SKU, lot, production date, age, house number
 * - Footer section: logistics info (crates, trays, vehicle plate, driver, serial)
 * 
 * Business Logic:
 * - Header "Delivered From" field auto-populates TIN and address based on selected farm
 * - Age field uses custom VerticalRuler popup for weeks/days selection
 * - House number automatically updates brdr_ref_no format: "{brdr_ref_no}-{house_no}"
 * - New items can be deleted; saved items cannot be removed from this form
 * - Breed field is shared across all line items (set once in header)
 * 
 * @component
 * @returns {React.ReactElement} Form UI with validation and submission flow
 * 
 * State Management:
 * - Global context: getValue/setValue for itemmaster, farms, loading state
 * - Local state: header record, line items, footer logistics, dates/temperatures
 * - Selected rows tracking for batch delete functionality
 * 
 * Dependencies:
 * - getUserInfo, createReceiving APIs
 * - GlobalContext and ConfirmProvider hooks
 * - ShadCN UI components (Input, Button, Table, Popover, etc.)
 */
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
import { DataRecordApproval, DefaultFarm, DraftItem, Farms } from '@/lib/types'
import { today } from '@/lib/Defaults/DefaultValues'
import Breadcrumb from '@/lib/Breadcrumb'
import SearchableDropdown from '@/lib/SearchableDropdown'
import { createReceiving, getUserInfo } from './api'
import { Plus, Save, CalendarDays } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { toast } from 'sonner'
import { VerticalRuler } from '@/components/VerticalRuler'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useConfirm } from '@/lib/ConfirmProvider'
import { refreshSessionx } from '@/app/admin/user/RefreshSession'
import SearchableCombobox from '@/components/SearchableCombobox'

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
  const confirm = useConfirm();
  const router = useRouter()
  const { getValue, setValue } = useGlobalContext()
  const [loading, setloading] = useState(false)
  const [farms, setfarms] = useState<Farms[]>([])
  const [header, setHeader] = useState<DataRecordApproval | null>(null)
  const [items, setItems] = useState<DraftItem[]>([])
  const [ItemMaster, setItemMaster] = useState<ItemMasterType[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const [postingDate, setPostingDate] = useState(today)
  const [temperature, setTemperature] = useState('')
  const [humidity, sethumidity] = useState('')
  const [brdr_ref_no, setbrdr_ref_no] = useState('')
  const [defaultFarm, setdefaultFarm] = useState<DefaultFarm>()

  const [activeWeeks, setActiveWeeks] = useState(26)
  const [activeDays, setActiveDays] = useState(0)

  const parseAge = (ageString: string) => {
    if (!ageString) return { w: 26, d: 0 }
    const match = ageString.match(/(\d+)\s+Weeks,\s+(\d+)\s+Day(s)/)
    if (match) {
      return { w: parseInt(match[1]), d: parseInt(match[2]) }
    }
    return { w: 26, d: 0 }
  }

  const getDefaultFarm = async () => {
    const data = await getUserInfo()
    setdefaultFarm(data[0])
    setHeader(h => h ? { ...h, delivered_to: data[0].code } : h)
  }

  useEffect(() => {
    getDefaultFarm()
  }, [])

  useEffect(() => {
    refreshSessionx(router)
  }, [])

  useEffect(() => {
    router.prefetch("/a_dean/receiving/")
    const init = () => {

      const items = getValue("itemmaster")
      const filterd = items.filter((items: any) => items.item_group === 'receiving_egg')
      console.log({ filterd })
      setItemMaster(filterd)
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
      age: '26 Weeks, 0 Day(s)'
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
  const [headerBreed, setHeaderBreed] = useState('')
  const headerFieldsLeft = [
    { required: true, disabled: false, code: "", label: 'Delivered Date', type: 'date', value: header?.doc_date || '', onChange: (v: string) => setHeader(h => h ? { ...h, doc_date: v } : h) },
    { required: true, disabled: true, code: "", label: 'Address', value: header?.address || '', onChange: (v: string) => setHeader(h => h ? { ...h, address: v } : h) },
    { required: false, disabled: true, code: "tin", label: 'Tin', value: header?.tin || '', onChange: (v: string) => setHeader(h => h ? { ...h, tin: v } : h) },
  ]

  const headerFieldsRight = [
    { disabled: true, code: "", label: 'Shipped To', type: 'text', value: defaultFarm?.code + ' - ' + defaultFarm?.name, onChange: setPostingDate },
    { required: false, disabled: false, code: "", label: 'Shipped Via', value: header?.shipped_via || '', onChange: (v: string) => setHeader(h => h ? { ...h, shipped_via: v } : h) },
    { required: true, disabled: false, code: "", label: 'Posting Date', type: 'date', value: postingDate, onChange: setPostingDate },
    { required: false, disabled: false, code: "", label: 'P.O No', value: header?.po_no || '', onChange: (v: string) => setHeader(h => h ? { ...h, po_no: v } : h) },
    { required: true, disabled: false, code: "", label: 'DR No', value: header?.dr_num || '', onChange: (v: string) => setHeader(h => h ? { ...h, dr_num: v } : h) },
    { required: false, disabled: false, code: "", label: 'Attention To', value: header?.Attention || '', onChange: (v: string) => setHeader(h => h ? { ...h, Attention: v } : h) },
    { required: false, disabled: false, code: "", label: 'Voyage No', value: header?.voyage_no || '', onChange: (v: string) => setHeader(h => h ? { ...h, voyage_no: v } : h) },
    { required: false, disabled: false, code: "", label: 'Temperature', type: 'number', value: temperature, onChange: setTemperature },
    { required: false, disabled: false, code: "", label: 'Humidity', type: 'number', value: humidity, onChange: sethumidity },
    { required: true, disabled: false, code: "", label: 'Breeder Ref. No.', type: 'text', value: brdr_ref_no, onChange: setbrdr_ref_no },
  ]

  const validateLineItems = () => {
    if (items.length === 0) {
      toast("Add at least one line item")
      return false
    }
    for (const row of items) {
      const missingFields: string[] = []
      if (!row.brdr_ref_no) missingFields.push("brdr_ref_no")
      if (!row.sku) missingFields.push("sku")
      if (!row.lot_no) missingFields.push("lot_no")
      // if (!row.breed) missingFields.push("breed")
      if (!row.prod_date) missingFields.push("prod_date")
      if (!row.age) missingFields.push("age")
      if (!row.house_no) missingFields.push("house_no")
      if (row.actual_total === undefined) missingFields.push("actual_total")
      if (headerBreed == "" || headerBreed == null) missingFields.push("Breed")

      if (missingFields.length > 0) {
        alert(`Missing fields: ${missingFields.join(", ")}`)
        return false
      }
    }
    return true
  }


  // const insertMe = async () => {
  //   setloading(true)

  //   const confirmed = await confirm({
  //     title: "Receive items?",
  //     description: "Are you sure you want to record these items as received?",
  //     confirmText: "Confirm receipt",
  //     cancelText: "Cancel",
  //   });

  //   setloading(confirmed)
  //   if (!confirmed) return;
  //   const transformedItems = items.map(i => ({
  //     ...i,
  //     brdr_ref_no: `${brdr_ref_no}-${i.house_no}`, // auto generate
  //     total_api: i.total ?? 0,
  //     actual_count: i.actual_total ?? 0,
  //   }))

  //   const payload = {
  //     doc_date: header?.doc_date,
  //     temperature,
  //     humidity,
  //     soldTo: header?.soldTo,
  //     Attention: header?.Attention,
  //     po_no: header?.po_no,
  //     voyage_no: header?.voyage_no,
  //     shipped_via: header?.shipped_via,
  //     dr_num: header?.dr_num,
  //     no_of_crates: footer.crates,
  //     no_of_tray: footer.trays,
  //     plate_no: footer.van_plate,
  //     driver: footer.driver,
  //     serial_no: footer.serial,
  //     delivered_to: defaultFarm?.code,
  //     brdr_ref_no: brdr_ref_no, // header value
  //     items: transformedItems,
  //   }
  //   // console.log({ payload })
  //   // return
  //   const res = await createReceiving(payload)

  //   if (res.success) {
  //     alert(`Saved! DocEntry: ${res.docentry}`)
  //     router.push("/a_dean/receiving/")
  //   } else {
  //     alert(res.error)
  //   }

  //   setloading(false)
  // }
  const insertMe = async () => {


    setloading(true)

    const confirmed = await confirm({
      title: "Receive items?",
      description: "Are you sure you want to record these items as received?",
      confirmText: "Confirm receipt",
      cancelText: "Cancel",
    });

    setloading(confirmed)
    if (!confirmed) return;
    console.log({ brdr_ref_no })
    const transformedItems = items.map(i => ({
      ...i,
      brdr_ref_no: `${brdr_ref_no ?? ""}-${i.house_no ?? ""}`,
      sku: i.sku ?? "",
      lot_no: i.lot_no ?? "",
      // www: i.breed ?? "",
      breed: headerBreed || "",
      house_no: i.house_no ?? "",
      prod_date: i.prod_date ?? "",
      prod_date_to: i.prod_date_to ?? "",
      age: i.age ?? "",
      total_api: i.total ?? 0,
      actual_count: i.actual_total ?? 0,
    }))
    console.log({ transformedItems })
    const payload = {
      doc_date: header?.doc_date ?? "",
      temperature: Number(temperature) || 0,
      humidity: Number(humidity) || 0,
      soldTo: header?.soldTo ?? "",
      Attention: header?.Attention ?? "",
      po_no: header?.po_no ?? "",
      voyage_no: header?.voyage_no ?? "",
      shipped_via: header?.shipped_via ?? "",
      dr_num: header?.dr_num ?? "",
      no_of_crates: Number(footer.crates) || 0,
      no_of_tray: Number(footer.trays) || 0,
      plate_no: footer.van_plate ?? "",
      driver: footer.driver ?? "",
      serial_no: footer.serial ?? "",
      delivered_to: defaultFarm?.code ?? "",
      brdr_ref_no: brdr_ref_no ?? "",
      items: transformedItems,
    }

    const res = await createReceiving(payload)

    if (res.success) {
      alert(`Saved! DocEntry: ${res.docentry}`)
      router.push("/a_dean/receiving/")
    } else {
      alert(res.error)
    }

    setloading(false)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLineItems()) return
    await insertMe()
  }

  const [footer, setFooter] = useState({
    crates: '',
    trays: '',
    van_plate: '',
    driver: '',
    serial: ''
  })

  useEffect(() => {
    setValue("loading_g", loading)
  }, [loading])
  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full border-none shadow-none bg-background p-0">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center mt-8">
            <div>
              <Breadcrumb
                FirstPreviewsPageName='Receiving'
                SecondPreviewPageName='Hatchery'
                CurrentPageName='Manual Receiving'
              />
            </div>
            <div className="flex gap-2">
              {/* <Button type="button" variant="outline" onClick={() => setloading(false)}>
                Check farms
              </Button> */}
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> Save Record
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className='bg-white rounded-2xl p-4 space-y-6'>
          <div className="sm:grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            <div className='mt-2'>
              <Label className='pb-2'>Delivered From</Label>
              {/* <SearchableDropdown
                list={farms}
                codeLabel="code"
                nameLabel="name"
                value={header?.soldTo || ''}
                onChange={(val) => {
                  const selectedFarm = farms.find((f: any) => f.code === val)
                  setHeader(h =>
                    h ? {
                      ...h,
                      soldTo: val,
                      tin: selectedFarm?.tin || '',
                      address: selectedFarm?.address || '',
                    } : h
                  )
                }}
              /> */}


              <SearchableCombobox
                multiple={false}
                showCode
                autoHighlight
                items={farms}
                value={header?.soldTo || ''}
                className='w-full'
                onValueChange={(val) => {
                  const selectedFarm = farms.find((f: any) => f.code === val)
                  setHeader(h =>
                    h ? {
                      ...h,
                      soldTo: val,
                      tin: selectedFarm?.tin || '',
                      address: selectedFarm?.address || '',
                    } : h
                  )
                }
                }

              />
            </div>
            {headerFieldsLeft.map((field, i) => (
              <div key={i} className='mt-1'>
                <Label required={field.required} className='pb-2 mt-1'>{field.label}</Label>
                <Input
                  required={field.required}
                  readOnly={field.disabled}
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={e => field.onChange?.(e.target.value)}
                />
              </div>
            ))}
          </div>

          <Separator className='my-2' />

          <div className="sm:grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {headerFieldsRight.map((field, i) => (
              <div key={i} className='mt-1'>
                <Label required={field.required} className='pb-2 mt-1'>{field.label}</Label>
                <Input
                  required={field.required}
                  disabled={field.disabled}
                  type={field.type || 'text'}
                  value={field.value}
                  onChange={e => field.onChange?.(e.target.value)}
                />
              </div>
            ))}

            <div className='mt-1'>
              <Label className='pb-2' required>Breed</Label>
              <Input
                required
                value={headerBreed}
                onChange={(e) => setHeaderBreed(e.target.value)}
              />
            </div>
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
                  <Plus className="mr-2 h-4 w-4" /> Add Row
                </Button>
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Line No</TableHead>
                    {/* <TableHead>BREEDER REF. NO.</TableHead> */}
                    <TableHead>EGG SKU</TableHead>
                    <TableHead>UoM</TableHead>
                    <TableHead>Lot No.</TableHead>
                    {/* <TableHead>Breed</TableHead> */}
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
                      {/* <TableCell>
                        <Input
                          required
                          value={item.brdr_ref_no || ''}
                          onChange={e => updateItem(item.id, { brdr_ref_no: e.target.value })}
                        />
                      </TableCell> */}
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
                          onChange={e => updateItem(item.id, { lot_no: e.target.value })}
                        />
                      </TableCell>
                      {/* <TableCell>
                        <Input
                          required
                          value={item.breed || ''}
                          onChange={e => updateItem(item.id, { breed: e.target.value })}
                        />
                      </TableCell> */}
                      <TableCell>
                        <DateRangePicker
                          onChange={(e) => {
                            updateItem(item.id, { prod_date: e.from })
                            updateItem(item.id, { prod_date_to: e.to })
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Popover onOpenChange={(open) => {
                          if (open) {
                            const { w, d } = parseAge(item.age || '26 Weeks, 0 Day(s)')
                            setActiveWeeks(w)
                            setActiveDays(d)
                          } else {
                            updateItem(item.id, { age: `${activeWeeks} Weeks, ${activeDays} Day(s)` })
                          }
                        }}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-45 justify-start text-left font-normal">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              {item.age || '26 Weeks, 0 Day(s)'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-4" align="start">
                            <div className="flex gap-4 items-center justify-center">
                              <VerticalRuler
                                label="Weeks"
                                min={26}
                                max={65}
                                value={activeWeeks}
                                onChange={setActiveWeeks}
                              />
                              <VerticalRuler
                                label="Days"
                                min={0}
                                max={6}
                                value={activeDays}
                                onChange={setActiveDays}
                              />
                            </div>
                            <div className="mt-4 text-center font-bold text-sm text-primary">
                              {activeWeeks} Weeks, {activeDays} Day(s)
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      {/* <TableCell>
                        <Input
                          required
                          value={item.house_no || ''}
                          onChange={e => updateItem(item.id, { house_no: e.target.value })}
                        />
                      </TableCell> */}
                      <TableCell>
                        <Input
                          required
                          maxLength={3}
                          value={item.house_no || ''}
                          onChange={e => {
                            const houseNo = e.target.value.slice(0, 3)
                            console.log(`${brdr_ref_no}-${houseNo}`)
                            updateItem(item.id, {
                              house_no: houseNo,
                            })
                            updateItem(item.id, {
                              brdr_ref_no: `${brdr_ref_no}-${houseNo}`
                            })
                          }}
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