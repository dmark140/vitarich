'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { getItemById, updateItem } from '../api'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { RefreshCcw } from 'lucide-react'

export default function EditItemPage() {
  const params = useSearchParams()
  const router = useRouter()

  const id = params.get('id')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [form, setForm] = useState<any>(null)

  // 🔹 Load item
  useEffect(() => {
      router.prefetch('/a_dean/items')
    if (!id) {
      router.push('/a_dean/items')
      return
    }

    const load = async () => {
      try {
        const data = await getItemById(Number(id))

        setForm({
          item_code: data.item_code || '',
          item_name: data.item_name || '',
          description: data.description || '',
          barcode: data.barcode || '',
          unit_measure: data.unit_measure || 'pcs',
          item_group: data.item_group || '',
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev: any) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!id) return

    setSaving(true)
    setMessage(null)

    try {
      await updateItem(Number(id), form)
      setMessage('✅ Item updated successfully')
    } catch (err: any) {
      setMessage('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  // 🔹 Loading state
  if (loading || !form) {
    return (
      <div className="flex justify-center mt-20">
        <RefreshCcw className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Item</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 🔹 GRID 2 COLUMNS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Item Code */}
              <div className="space-y-2">
                <Label>Item Code</Label>
                <Input
                  name="item_code"
                  value={form.item_code}
                  onChange={handleChange}
                />
              </div>

              {/* Item Name */}
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  name="item_name"
                  value={form.item_name}
                  onChange={handleChange}
                />
              </div>

              {/* Barcode */}
              <div className="space-y-2">
                <Label>Barcode</Label>
                <Input
                  name="barcode"
                  value={form.barcode}
                  onChange={handleChange}
                />
              </div>

              {/* Item Group */}
              <div className="space-y-2">
                <Label>Item Group</Label>
                <Input
                  name="item_group"
                  value={form.item_group}
                  onChange={handleChange}
                />
              </div>

              {/* UoM Dropdown */}
              <div className="space-y-2">
                <Label>Unit of Measure</Label>

                <Select
                  value={form.unit_measure}
                  onValueChange={(value) =>
                    setForm((prev: any) => ({
                      ...prev,
                      unit_measure: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="pcs">pcs (Pieces)</SelectItem>
                    <SelectItem value="box">box</SelectItem>
                    <SelectItem value="pack">pack</SelectItem>
                    <SelectItem value="set">set</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="liter">liter</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="meter">meter</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="roll">roll</SelectItem>
                    <SelectItem value="pair">pair</SelectItem>
                    <SelectItem value="dozen">dozen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push('/a_dean/items')
                }
              >
                Back
              </Button>

              {message && (
                <span className="text-sm">{message}</span>
              )}
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
