"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createPreWarming } from "./api"
import Breadcrumb from "@/lib/Breadcrumb"

type FormState = {
  egg_ref_no: string
  pre_temp: string
  egg_temp: string
  egg_temp_time_start: string // datetime-local value
  egg_temp_time_end: string // datetime-local value
  remarks: string
}

function durationInMinutes(startIsoLocal: string, endIsoLocal: string): number | null {
  if (!startIsoLocal || !endIsoLocal) return null

  const start = new Date(startIsoLocal).getTime()
  const end = new Date(endIsoLocal).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) return null
  const diffMs = end - start
  if (diffMs < 0) return null

  return Math.round(diffMs / 60000)
}

function fmtDuration(mins: number | null) {
  if (mins == null) return ""
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h <= 0) return `${m} min`
  return `${h} hr ${m} min`
}



export default function Prewarmingform() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<FormState>({
    egg_ref_no: "",
    pre_temp: "",
    egg_temp: "",
    egg_temp_time_start: "",
    egg_temp_time_end: "",
    remarks: "",
  })

const durationMins = useMemo(
  () => durationInMinutes(form.egg_temp_time_start, form.egg_temp_time_end),
  [form.egg_temp_time_start, form.egg_temp_time_end]
)

const durationDisplay = useMemo(
  () => fmtDuration(durationMins),
  [durationMins]
)

  async function onSave() {
    // Basic validations (adjust if you want stricter)
    if (!form.egg_ref_no.trim()) {
      alert("Egg Reference No. is required.")
      return
    }
    if (form.egg_temp_time_start && form.egg_temp_time_end && durationMins === null) {
      alert("End Time must be after Start Time.")
      return
    }

    setSaving(true)
    try {
      await createPreWarming({
        egg_ref_no: form.egg_ref_no.trim(),
        pre_temp: form.pre_temp || null,
        egg_temp: form.egg_temp || null,
        egg_temp_time_start: form.egg_temp_time_start || null,
        egg_temp_time_end: form.egg_temp_time_end || null, 
        duration: durationMins,
        remarks: form.remarks || null,
        is_active: true,
      })

      router.push("/a_baja/prewarming")
      router.refresh()
    } catch (e: any) {
      alert(e?.message ?? "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <Breadcrumb
        SecondPreviewPageName="Hatchery"
        FirstPreviewsPageName="Egg Pre-Warming"
        CurrentPageName="New Entry"
      />
      <Card className="max-w-4xl ml-0 p-6 space-y-4">

        <CardContent className="pt-4 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Egg Reference No.</Label>
              <Input
                value={form.egg_ref_no}
                onChange={(e) => setForm((p) => ({ ...p, egg_ref_no: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Pre-Warming Temp</Label>
              <Input
                value={form.pre_temp}
                onChange={(e) => setForm((p) => ({ ...p, pre_temp: e.target.value }))}
                placeholder=""
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Egg Shell Temp</Label>
              <Input
                value={form.egg_temp}
                onChange={(e) => setForm((p) => ({ ...p, egg_temp: e.target.value }))}
                placeholder=""
              />
            </div>
            <div />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="datetime-local"
                value={form.egg_temp_time_start}
                onChange={(e) => setForm((p) => ({ ...p, egg_temp_time_start: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="datetime-local"
                value={form.egg_temp_time_end}
                onChange={(e) => setForm((p) => ({ ...p, egg_temp_time_end: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration </Label>
              <Input value={durationDisplay ?? ""} disabled placeholder="" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea
              value={form.remarks}
              onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))}
              className="min-h-27.5"
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
              onClick={() => router.push("/a_baja/prewarming")}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
