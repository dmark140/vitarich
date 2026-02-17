"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { createSetterIncubation } from "./api"
import Breadcrumb from "@/lib/Breadcrumb"

type FormState = {
  ref_no: string
  setting_date: string // datetime-local
  farm_source: string
  machine_id: string

  total_eggs: string
  incubation_duration: string

  setter_temp: string
  egg_shell_temp: string

  setter_humidity: string
  egg_shell_temp_dt: string // datetime-local

  turning_interval: string
  egg_shell_orientation: "Pointed Up" | "Pointed Down" | "Pointed Middle"

  turning_angle: string
}

export default function Eggsetterform() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<FormState>({
    ref_no: "",
    setting_date: "",
    farm_source: "",
    machine_id: "",

    total_eggs: "",
    incubation_duration: "",

    setter_temp: "",
    egg_shell_temp: "",

    setter_humidity: "",
    egg_shell_temp_dt: "",

    turning_interval: "",
    egg_shell_orientation: "Pointed Down",

    turning_angle: "",
  })

  // optional computed value example (you can remove if not needed)
  const isValidDates = useMemo(() => {
    if (!form.setting_date) return true
    if (!form.egg_shell_temp_dt) return true
    return new Date(form.egg_shell_temp_dt).getTime() >= new Date(form.setting_date).getTime()
  }, [form.setting_date, form.egg_shell_temp_dt])

  async function onSave() {
    // Basic validations (same style as Prewarmingform)
    if (!form.setting_date) {
      alert("Setting Date is required.")
      return
    }
    if (!form.machine_id.trim()) {
      alert("Setter Machine ID is required.")
      return
    }
    if (!isValidDates) {
      alert("Egg Shell Temp Date & Time must be after Setting Date.")
      return
    }

    setSaving(true)
    try {
      await createSetterIncubation({
        ref_no: form.ref_no.trim() || null,
        setting_date: form.setting_date ? new Date(form.setting_date).toISOString() : null,
        farm_source: form.farm_source.trim() || null,
        machine_id: form.machine_id.trim() || null,

        total_eggs: form.total_eggs ? Number(form.total_eggs) : null,
        incubation_duration: form.incubation_duration ? Number(form.incubation_duration) : null,

        setter_temp: form.setter_temp ? Number(form.setter_temp) : null,
        egg_shell_temp: form.egg_shell_temp ? Number(form.egg_shell_temp) : null,

        setter_humidity: form.setter_humidity ? Number(form.setter_humidity) : null,
        egg_shell_temp_dt: form.egg_shell_temp_dt
          ? new Date(form.egg_shell_temp_dt).toISOString()
          : null,

        turning_interval: form.turning_interval ? Number(form.turning_interval) : null,
        egg_shell_orientation: form.egg_shell_orientation || null,

        turning_angle: form.turning_angle ? Number(form.turning_angle) : null,
      })

      router.push("/a_baja/eggsetter")
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
        FirstPreviewsPageName="Egg Setter List"
        CurrentPageName="New Entry"
      />
      <Card className="max-w-6xl ml-0 p-6 space-y-4">
        {/* <CardHeader className="pb-3">
          <CardTitle>Egg Setting Record</CardTitle>
        </CardHeader> */}

        {/* <Separator /> */}

        <CardContent className="pt-4 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input
                value={form.ref_no}
                onChange={(e) => setForm((p) => ({ ...p, ref_no: e.target.value }))}
                placeholder="AUTO"
              />
            </div>

            <div className="space-y-2">
              <Label>Setting Date</Label>
              <Input
                type="datetime-local"
                value={form.setting_date}
                onChange={(e) => setForm((p) => ({ ...p, setting_date: e.target.value }))}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Farm Source</Label>
              <Input
                value={form.farm_source}
                onChange={(e) => setForm((p) => ({ ...p, farm_source: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Setter Machine ID</Label>
              <Input
                value={form.machine_id}
                onChange={(e) => setForm((p) => ({ ...p, machine_id: e.target.value }))}
                placeholder=""
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Number of Egg Set</Label>
              <Input
                type="number"
                value={form.total_eggs}
                onChange={(e) => setForm((p) => ({ ...p, total_eggs: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Incubation Duration (days)</Label>
              <Input
                type="number"
                value={form.incubation_duration}
                onChange={(e) => setForm((p) => ({ ...p, incubation_duration: e.target.value }))}
                placeholder=""
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Setter Temperature (°C)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.setter_temp}
                onChange={(e) => setForm((p) => ({ ...p, setter_temp: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Egg Shell Temperature (°C)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.egg_shell_temp}
                onChange={(e) => setForm((p) => ({ ...p, egg_shell_temp: e.target.value }))}
                placeholder=""
              />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Setter Humidity (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.setter_humidity}
                onChange={(e) => setForm((p) => ({ ...p, setter_humidity: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Egg Shell Temp Date &amp; Time</Label>
              <Input
                type="datetime-local"
                value={form.egg_shell_temp_dt}
                onChange={(e) => setForm((p) => ({ ...p, egg_shell_temp_dt: e.target.value }))}
              />
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Turning Interval (mins)</Label>
              <Input
                type="number"
                value={form.turning_interval}
                onChange={(e) => setForm((p) => ({ ...p, turning_interval: e.target.value }))}
                placeholder=""
              />
            </div>

            <div className="space-y-2">
              <Label>Egg Shell Orientation</Label>
              <Select
                value={form.egg_shell_orientation}
                onValueChange={(v: any) => setForm((p) => ({ ...p, egg_shell_orientation: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pointed Up">Pointed Up</SelectItem>
                  <SelectItem value="Pointed Down">Pointed Down</SelectItem>
                  <SelectItem value="Pointed Middle">Pointed Middle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 7 */}
          <div className="space-y-2">
            <Label>Turning Angle (°)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.turning_angle}
              onChange={(e) => setForm((p) => ({ ...p, turning_angle: e.target.value }))}
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
              onClick={() => router.push("/a_baja/eggsetter")}
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
