'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  approveHatcheryDraft,
  getHatcheryDraftItems,
  rejectHatcheryDraft
} from './api'
import { DataRecordApproval } from '@/lib/types'
import { today } from '@/lib/Defaults/DefaultValues'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/lib/Breadcrumb'

type DraftItem = {
  id: number
  sku: string
  sku_display?: string
  brdr_ref_no: string
  UoM: string
  expected_count: number
  actual_count?: number
  remarks?: string
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
  const [loading, setLoading] = useState(false)

  const [postingDate, setPostingDate] = useState(today)
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')

  const getItemMaster = async () => {
    const data = await getValue("itemmaster")
    setItemMaster(data || [])
  }

  useEffect(() => {
    getItemMaster()
    route.prefetch("/a_dean/receiving")
    const contextData = getValue('forApproval')

    if (contextData?.row) {
      setHeader(contextData.row)
      setPostingDate(contextData.row.posting_date || today)
    } else {
      route.push("/a_dean/receiving")
    }
  }, [getValue])

  useEffect(() => {
    if (!header?.docentry) return

    const fetchItems = async () => {
      setLoading(true)
      const { data } = await getHatcheryDraftItems(Number(header.docentry))

      if (data) {
        setItems(
          data.map((i: DraftItem) => ({
            ...i,
            actual_count: undefined,
            isNew: false,
          }))
        )
      }

      setLoading(false)
    }

    fetchItems()
  }, [header])

  // ---------- VALIDATION ----------
  const isFormValid = useMemo(() => {
    if (!postingDate) return false
    if (new Date(postingDate) > new Date()) return false
    if (!temperature.trim() || !humidity.trim()) return false

    for (const i of items) {
      if (i.actual_count == null) return false

      if (i.isNew) {
        if (!i.brdr_ref_no?.trim()) return false
        if (!i.sku) return false
      }
    }

    return true
  }, [postingDate, temperature, humidity, items])

  // ---------- HANDLERS ----------
  const updateItem = (id: number, changes: Partial<DraftItem>) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, ...changes } : i))
    )
  }

  const handleSkuChange = (id: number, displayValue: string) => {
    const code = displayValue.split(' — ')[0]
    const selected = ItemMaster.find(i => i.item_code === code)

    if (selected) {
      updateItem(id, {
        sku: selected.item_code,
        sku_display: `${selected.item_code} — ${selected.item_name}`,
        UoM: selected.unit_measure || 'PCS',
      })
    } else {
      updateItem(id, {
        sku: '',
        sku_display: displayValue,
      })
    }
  }

  const addRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: Date.now(),
        sku: '',
        sku_display: '',
        brdr_ref_no: '',
        UoM: 'PCS',
        expected_count: 0,
        actual_count: undefined,
        remarks: '',
        isNew: true,
      },
    ])
  }

  const removeRow = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  // ---------- ACTIONS ----------
  const approveDocument = async () => {
    if (!header?.docentry || !isFormValid) return

    const res = await approveHatcheryDraft({
      docentry: Number(header.docentry),
      posting_date: postingDate,
      temperature,
      humidity,
      items: items.map(i => ({
        sku: i.sku,
        actual_count: Number(i.actual_count),
        remarks: i.remarks || '',
      })),
    })

    if (!res.success) return alert(res.error)

    setValue("forApproval", [])
    alert('Document approved and posted to inventory')
    route.push("/a_dean/receiving")
  }

  const rejectDocument = async () => {
    if (!header?.uid) return

    const res = await rejectHatcheryDraft(
      Number(header.uid),
      'Rejected by approver'
    )

    if (!res.success) return alert(res.error)

    alert('Document rejected')
    route.push("/a_dean/receiving")
  }

  if (!header) return null

  return (
    <Card className="w-full border-none shadow-none bg-background p-0">
      <CardHeader className="border-b">
        <div className="flex justify-between">
          <Breadcrumb
            FirstPreviewsPageName='Hatchery'
            CurrentPageName='Receiving'
          />

          <div className="flex gap-3">
            <Button variant="destructive" onClick={rejectDocument}>
              Reject
            </Button>

            <Button onClick={approveDocument} disabled={!isFormValid}>
              Receive
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className='bg-white rounded-2xl p-4'>

        {/* HEADER FORM */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label>Posting Date</Label>
              <Input
                type="date"
                value={postingDate}
                max={today}
                onChange={e => setPostingDate(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>DR Number</Label>
              <Input value={header.id} readOnly />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label>Temperature *</Label>
              <Input
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Humidity *</Label>
              <Input
                value={humidity}
                onChange={e => setHumidity(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-1.5 mt-2">
          <Label>Remarks</Label>
          <Input />
        </div>

        {/* ITEMS TABLE */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-green-700">Items</Label>
            <Button type="button" variant="outline" onClick={addRow}>
              Add Row
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>BREEDER REF</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>UoM</TableHead>
                  <TableHead className="text-center">Expected</TableHead>
                  <TableHead className="text-center">Actual *</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead className="text-right w-25">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>

                    <TableCell>
                      {item.isNew ? (
                        <Input
                          value={item.brdr_ref_no}
                          onChange={e =>
                            updateItem(item.id, { brdr_ref_no: e.target.value })
                          }
                          className="h-8"
                        />
                      ) : (
                        item.brdr_ref_no
                      )}
                    </TableCell>

                    <TableCell>
                      {item.isNew ? (
                        <>
                          <Input
                            list={`sku-options-${item.id}`}
                            value={item.sku_display || ''}
                            onChange={e =>
                              handleSkuChange(item.id, e.target.value)
                            }
                            className="h-8"
                          />

                          <datalist id={`sku-options-${item.id}`}>
                            {ItemMaster.map(im => (
                              <option
                                key={im.id}
                                value={`${im.item_code} — ${im.item_name}`}
                              />
                            ))}
                          </datalist>
                        </>
                      ) : (
                        item.sku
                      )}
                    </TableCell>

                    <TableCell>{item.UoM}</TableCell>

                    <TableCell className="text-center">
                      {item.isNew ? '' : (
                        <Badge variant="secondary">
                          {item.expected_count}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="p-1">
                      <Input
                        type="number"
                        min={0}
                        value={item.actual_count ?? ''}
                        onChange={e =>
                          updateItem(item.id, {
                            actual_count: Number(e.target.value),
                          })
                        }
                        className="h-8 text-center"
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        value={item.remarks || ''}
                        onChange={e =>
                          updateItem(item.id, { remarks: e.target.value })
                        }
                        className="h-8"
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      {item.isNew && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRow(item.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
