"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { createEggTransfer } from "./api"
import Breadcrumb from "@/lib/Breadcrumb"

type FormState = {
  ref_no: string
  farm_source: string

  trans_date_start: string // datetime-local
  trans_date_end: string // datetime-local

  duration: string // auto (minutes) display only
  num_bangers: string
  total_egg_transfer: string
}

function minutesBetween(start: string, end: string) {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  if (isNaN(a) || isNaN(b)) return null
  if (b < a) return null
  return Math.floor((b - a) / 60000)
}

function fmtDuration(mins: number | null) {
  if (mins == null) return ""
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h <= 0) return `${m}m`
  return `${h}h ${m}m`
}

export default function EggTransferForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<FormState>({
    ref_no: "",
    farm_source: "",

    trans_date_start: "",
    trans_date_end: "",

    duration: "",
    num_bangers: "",
    total_egg_transfer: "",
  })

  const durationMinutes = useMemo(() => {
    if (!form.trans_date_start) return null
    if (!form.trans_date_end) return null
    return minutesBetween(form.trans_date_start, form.trans_date_end)
  }, [form.trans_date_start, form.trans_date_end])

  const isValidDates = useMemo(() => {
    if (!form.trans_date_start) return true
    if (!form.trans_date_end) return true
    return durationMinutes !== null
  }, [form.trans_date_start, form.trans_date_end, durationMinutes])

  async function onSave() {
    // Basic validations (same style as Eggsetterform)
    if (!form.trans_date_start) {
      alert("Transfer Date & Time Start is required.")
      return
    }
    if (!form.trans_date_end) {
      alert("Transfer Date & Time End is required.")
      return
    }
    if (!isValidDates) {
      alert("Transfer End must be after Transfer Start.")
      return
    }

    setSaving(true)
    try {
      await createEggTransfer({
        ref_no: form.ref_no.trim() || null,
        farm_source: form.farm_source.trim() || null,

        trans_date_start: form.trans_date_start
          ? new Date(form.trans_date_start).toISOString()
          : null,
        trans_date_end: form.trans_date_end
          ? new Date(form.trans_date_end).toISOString()
          : null,

        duration: durationMinutes,

        num_bangers: form.num_bangers ? Number(form.num_bangers) : null,
        total_egg_transfer: form.total_egg_transfer
          ? Number(form.total_egg_transfer)
          : null,
      })

      router.push("/a_baja/eggtransfer")
      router.refresh()
    } catch (e: any) {
      alert(e?.message ?? "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-5 space-y-4">
      <Breadcrumb
        SecondPreviewPageName="Hatchery"
        FirstPreviewsPageName="Egg Transfer"
        CurrentPageName="New Entry"
      />
      <Card className="max-w-6xl ml-0 p-6 space-y-4">


        <CardContent className="pt-4 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={form.ref_no}
                onChange={(e) => setForm((p) => ({ ...p, ref_no: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Farm Source</Label>
              <Input
                value={form.farm_source}
                onChange={(e) =>
                  setForm((p) => ({ ...p, farm_source: e.target.value }))
                }
                placeholder=""
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Transfer Date &amp; Time Start</Label>
              <Input
                type="datetime-local"
                value={form.trans_date_start}
                onChange={(e) =>
                  setForm((p) => ({ ...p, trans_date_start: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Transfer Date &amp; Time End</Label>
              <Input
                type="datetime-local"
                value={form.trans_date_end}
                onChange={(e) =>
                  setForm((p) => ({ ...p, trans_date_end: e.target.value }))
                }
              />
              {form.trans_date_start && form.trans_date_end && !isValidDates ? (
                <p className="text-xs text-destructive mt-1">
                  End must be after Start.
                </p>
              ) : null}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                disabled
                value={fmtDuration(durationMinutes)}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>No. of Bangers</Label>
              <Input
                type="number"
                value={form.num_bangers}
                onChange={(e) =>
                  setForm((p) => ({ ...p, num_bangers: e.target.value }))
                }
                placeholder=""
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <Label>Total Egg Transfer</Label>
            <Input
              type="number"
              value={form.total_egg_transfer}
              onChange={(e) =>
                setForm((p) => ({ ...p, total_egg_transfer: e.target.value }))
              }
              placeholder=""
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/a_baja/eggtransfer")}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card></div>
  )
}
