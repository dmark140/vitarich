

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useGlobalContext } from '@/lib/context/GlobalContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { approveHatcheryDraft, getHatcheryDraftItems, rejectHatcheryDraft } from './api'
import { DataRecordApproval } from '@/lib/types'
import { today } from '@/lib/Defaults/DefaultValues'
import { useRouter } from 'next/navigation'

type DraftItem = {
  id: number
  sku: string
  brdr_ref_no: string
  UoM: string
  expected_count: number
  actual_count?: number
  breeder_ref?: string
}

export default function ApprovalDecisionForm() {
  const { getValue } = useGlobalContext()
  const route = useRouter()

  const [header, setHeader] = useState<DataRecordApproval | null>(null)
  const [items, setItems] = useState<DraftItem[]>([])
  const [loading, setLoading] = useState(false)

  // 🔹 NEW controlled states
  const [postingDate, setPostingDate] = useState(today)
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')

  /* ---------------------------------- effects ---------------------------------- */

  useEffect(() => {
    const contextData = getValue('forApproval')
    if (contextData?.row) {
      setHeader(contextData.row)
      setPostingDate(contextData.row.posting_date || today)
    }
  }, [getValue])
  useEffect(() => {
    route.prefetch("/a_dean/receiving")
  }, [])

  useEffect(() => {

    if (!header?.docentry) return

    const fetchItems = async () => {
      setLoading(true)
      const { data } = await getHatcheryDraftItems(Number(header.docentry))
      console.log({ data })
      if (data) {
        setItems(
          data.map((i: DraftItem) => ({
            ...i,
            actual_count: undefined,
          }))
        )
      }
      setLoading(false)
    }

    fetchItems()
  }, [header])

  /* -------------------------------- validation -------------------------------- */

  const isFormValid = useMemo(() => {
    if (!postingDate) return false
    if (new Date(postingDate) > new Date()) return false
    if (!temperature.trim() || !humidity.trim()) return false
    if (items.some(i => i.actual_count == null)) return false
    return true
  }, [postingDate, temperature, humidity, items])

  /* -------------------------------- handlers ---------------------------------- */

  const handleActualCountChange = (id: number, value: string) => {
    setItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, actual_count: Number(value) } : i
      )
    )
  }

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
      })),
    })

    if (!res.success) {
      alert(res.error)
      return
    }

    alert('Document approved and posted to inventory')
    route.push("/a_dean/receiving")
    // location.reload()
  }

  const rejectDocument = async () => {
    if (!header?.uid) return
    const res = await rejectHatcheryDraft(Number(header.uid), 'Rejected by approver')
    if (!res.success) {
      alert(res.error)
      return
    }
    alert('Document rejected')
    location.reload()
  }

  if (!header) return null

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div>
      <Card className="w-full border-none shadow-none bg-background p-0">
        <CardHeader className="border-b">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-xl">Receiving Form</CardTitle>
              <Badge variant="secondary">{header.status}</Badge>
            </div>

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

        <CardContent>
          {/* ---------------- Header Fields ---------------- */}
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
                  placeholder="e.g. 26°C"
                />
              </div>

              <div className="grid gap-1.5">
                <Label>Humidity *</Label>
                <Input
                  value={humidity}
                  onChange={e => setHumidity(e.target.value)}
                  placeholder="e.g. 60%"
                />
              </div>
            </div>
          </div>

          {/* ---------------- Items ---------------- */}
          <div className="mt-6 space-y-3">
            <Label className="text-green-700">Items</Label>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>BREEDER REF</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>UoM</TableHead>
                    <TableHead className="text-center">Expected</TableHead>
                    <TableHead className="text-center">Actual *</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.brdr_ref_no}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.UoM}</TableCell>
                      <TableCell className="text-center">
                        {item.expected_count}
                      </TableCell>
                      <TableCell className="p-1">
                        <Input
                          type="number"
                          min={0}
                          value={item.actual_count ?? ''}
                          onChange={e =>
                            handleActualCountChange(item.id, e.target.value)
                          }
                          className="h-8 text-center"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* <Button onClick={() => console.log({ items })}>Check items</Button> */}
    </div>
  )
}
