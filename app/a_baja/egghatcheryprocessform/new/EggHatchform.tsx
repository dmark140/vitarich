// app/a_baja/egghatcheryprocessform/new/EggHatchform.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  createEggHatcheryProcess,
  deleteEggHatcheryProcess,
  getEggHatcheryProcessById,
  updateEggHatcheryProcess,
  type EggHatcheryProcess,
} from "./api"

function toDatetimeLocalValue(v: string | null | undefined) {
  if (!v) return ""
  // v is timestamp without tz (string). We’ll convert to "YYYY-MM-DDTHH:mm"
  // If v already has "T", keep it.
  const d = new Date(v)
  const pad = (n: number) => String(n).padStart(2, "0")
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function diffMinutes(start: string, end: string) {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  const mins = Math.round((b - a) / 60000)
  return mins >= 0 ? mins : null
}

export default function EggHatchform() {
  const router = useRouter()
  const sp = useSearchParams()
  const idParam = sp.get("id")
  const editId = useMemo(() => (idParam ? Number(idParam) : null), [idParam])

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    egg_ref: "",
    farm_source: "",
    daterec: "",

    machine_no: "",
    hatch_temp: "",
    hatch_humidity: "",

    hatch_time_start: "",
    hatch_time_end: "",
    duration: "" as string, // auto (minutes)

    hatch_window: "",
    total_egg: "",
  })

  const isEdit = !!editId

  useEffect(() => {
    if (!editId) return
    setLoading(true)
    ;(async () => {
      try {
        const data = await getEggHatcheryProcessById(editId)
        setForm({
          egg_ref: data.egg_ref ?? "",
          farm_source: data.farm_source ?? "",
          daterec: data.daterec ?? "",

          machine_no: data.machine_no ?? "",
          hatch_temp: data.hatch_temp ?? "",
          hatch_humidity: data.hatch_humidity ?? "",

          hatch_time_start: toDatetimeLocalValue(data.hatch_time_start),
          hatch_time_end: toDatetimeLocalValue(data.hatch_time_end),
          duration: data.duration != null ? String(data.duration) : "",

          hatch_window: data.hatch_window != null ? String(data.hatch_window) : "",
          total_egg: data.total_egg != null ? String(data.total_egg) : "",
        })
      } catch (e: any) {
        alert(e?.message ?? "Failed to load record.")
      } finally {
        setLoading(false)
      }
    })()
  }, [editId])

  // Auto compute duration (minutes)
  useEffect(() => {
    if (!form.hatch_time_start || !form.hatch_time_end) {
      setForm((p) => ({ ...p, duration: "" }))
      return
    }
    const mins = diffMinutes(form.hatch_time_start, form.hatch_time_end)
    setForm((p) => ({ ...p, duration: mins == null ? "" : String(mins) }))
  }, [form.hatch_time_start, form.hatch_time_end])

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((p) => ({ ...p, [key]: value }))
  }

  async function onSave() {
    setSaving(true)
    try {
      const payload = {
        egg_ref: form.egg_ref || null,
        farm_source: form.farm_source || null,
        daterec: form.daterec || null,
        machine_no: form.machine_no || null,
        hatch_temp: form.hatch_temp || null,
        hatch_humidity: form.hatch_humidity || null,
        hatch_time_start: form.hatch_time_start ? new Date(form.hatch_time_start).toISOString() : null,
        hatch_time_end: form.hatch_time_end ? new Date(form.hatch_time_end).toISOString() : null,
        duration: form.duration ? Number(form.duration) : null,
        hatch_window: form.hatch_window ? Number(form.hatch_window) : null,
        total_egg: form.total_egg ? Number(form.total_egg) : null,
      }

      if (isEdit && editId) {
        await updateEggHatcheryProcess(editId, payload)
        alert("Updated successfully.")
      } else {
        await createEggHatcheryProcess(payload)
        alert("Saved successfully.")
      }

      router.push("/a_baja/egghatcheryprocessform")
      router.refresh()
    } catch (e: any) {
      alert(e?.message ?? "Save failed.")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete() {
    if (!editId) return
    const ok = confirm("Delete this record?")
    if (!ok) return
    setSaving(true)
    try {
      await deleteEggHatcheryProcess(editId)
      alert("Deleted.")
      router.push("/a_baja/egghatcheryprocessform")
      router.refresh()
    } catch (e: any) {
      alert(e?.message ?? "Delete failed.")
    } finally {
      setSaving(false)
    }
  }

  return (
<Card className="max-w-3xl ml-0 p-6">
  <CardHeader>
    <CardTitle>{isEdit ? "Edit Egg Hatchery Process" : "Egg Hatchery Process"}</CardTitle>
  </CardHeader>

  <Separator className="my-1" />

  <CardContent className="pt-4">
    {loading ? (
      <div className="text-sm text-muted-foreground">Loading...</div>
    ) : (
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Egg Reference</Label>
            <Input
              value={form.egg_ref}
              onChange={(e) => setField("egg_ref", e.target.value)}
              placeholder="01FARM1-B1-P1-01012026"
            />
          </div>

          <div className="space-y-1">
            <Label>Farm Source</Label>
            <Input
              value={form.farm_source}
              onChange={(e) => setField("farm_source", e.target.value)}
              placeholder="PETRI"
            />
          </div>

          <div className="space-y-1">
            <Label>Date Received</Label>
            <Input
              type="date"
              value={form.daterec}
              onChange={(e) => setField("daterec", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Machine No.</Label>
            <Input
              value={form.machine_no}
              onChange={(e) => setField("machine_no", e.target.value)}
              placeholder="HATCHER 001"
            />
          </div>
        </div>

        {/* Hatch Temp + Humidity (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Hatch Temperature</Label>
            <Input
              value={form.hatch_temp}
              onChange={(e) => setField("hatch_temp", e.target.value)}
              placeholder='35 °C'
            />
          </div>

          <div className="space-y-1">
            <Label>Hatch Humidity</Label>
            <Input
              value={form.hatch_humidity}
              onChange={(e) => setField("hatch_humidity", e.target.value)}
              placeholder="85%"
            />
          </div>
        </div>

        {/* Time Start + End (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Hatch Time Start</Label>
            <Input
              type="datetime-local"
              value={form.hatch_time_start}
              onChange={(e) => setField("hatch_time_start", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Hatch Time End</Label>
            <Input
              type="datetime-local"
              value={form.hatch_time_end}
              onChange={(e) => setField("hatch_time_end", e.target.value)}
            />
          </div>
        </div>

        {/* Duration + Hatch Window (2 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Duration (minutes)</Label>
            <Input value={form.duration} disabled placeholder="AUTO" />
          </div>

          <div className="space-y-1">
            <Label>Hatch Window (minutes)</Label>
            <Input
              inputMode="numeric"
              value={form.hatch_window}
              onChange={(e) => setField("hatch_window", e.target.value)}
              placeholder="120"
            />
          </div>
        </div>

        {/* Total Egg (1 col) */}
        <div className="space-y-1">
          <Label>Total Egg</Label>
          <Input
            inputMode="numeric"
            value={form.total_egg}
            onChange={(e) => setField("total_egg", e.target.value)}
            placeholder="10000"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <Button type="button" onClick={onSave} disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update" : "Save"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/a_baja/egghatcheryprocessform")}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    )}
  </CardContent>
</Card>

  )
}

              {/* {isEdit ? (
                <Button type="button" variant="destructive" onClick={onDelete} disabled={saving}>
                  Delete
                </Button>
              ) : null} */}
