
"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { createEggStorage, EggStorageInsert } from "./api"

function toDatetimeLocalValue(iso: string | null) {
  if (!iso) return ""
  const d = new Date(iso)
  // converts to local datetime-local format: YYYY-MM-DDTHH:mm
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

function fromDatetimeLocalValue(value: string) {
  // value like "2026-02-12T18:30"
  if (!value) return null
  const d = new Date(value)
  return d.toISOString()
}

export default function Eggstorageform() {
  const router = useRouter()

  const [saving, setSaving] = useState(false)

  const [stor_temp, setStorTemp] = useState("")
  const [room_temp, setRoomTemp] = useState("")
  const [stor_humi, setStorHumi] = useState("")

  const [shellStartLocal, setShellStartLocal] = useState("") // datetime-local
  const [shellEndLocal, setShellEndLocal] = useState("")     // datetime-local

  const [remarks, setRemarks] = useState("")

  const durationSeconds = useMemo(() => {
    if (!shellStartLocal || !shellEndLocal) return null
    const s = new Date(shellStartLocal).getTime()
    const e = new Date(shellEndLocal).getTime()
    if (Number.isNaN(s) || Number.isNaN(e) || e < s) return null
    return Math.floor((e - s) / 1000)
  }, [shellStartLocal, shellEndLocal])

  const durationDisplay = useMemo(() => {
    if (durationSeconds == null) return "AUTO"
    const mins = Math.floor(durationSeconds / 60)
    const secs = durationSeconds % 60
    return `${mins}m`
    // return `${mins}m ${secs}s`
  }, [durationSeconds])

  async function onSave() {
    try {
      setSaving(true)

      const payload: EggStorageInsert = {
        stor_temp: stor_temp || null,
        room_temp: room_temp || null,
        stor_humi: stor_humi || null,
        shell_start: fromDatetimeLocalValue(shellStartLocal),
        shell_end: fromDatetimeLocalValue(shellEndLocal),
        duration: durationSeconds,
        remarks: remarks || null,
      }

      await createEggStorage(payload)

      router.push("/a_baja/eggstorage") // go back to list
      router.refresh()
    } catch (err: any) {
      alert(err?.message ?? "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Egg Storage Management</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-4 space-y-4"> 
        {/* TEMPS / HUMI */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-2">
            <Label>Storage Temperature</Label>
            <Input
              value={stor_temp}
              onChange={(e) => setStorTemp(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label>Room Temperature</Label>
            <Input
              value={room_temp}
              onChange={(e) => setRoomTemp(e.target.value)}
            //   placeholder="e.g. 26°C"
            />
          </div>

          <div className="grid grid-cols-1 gap-2"> 
            <Label>Storage Humidity</Label>
            <Input
              value={stor_humi}
              onChange={(e) => setStorHumi(e.target.value)} 
            />
          </div>
        </div>

        <Separator />

        {/* SHELL TEMP TIMESTAMPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="grid grid-cols-1 gap-2">
            <Label>Shell Temp DateTime Start</Label>
            <Input
              type="datetime-local"
              value={shellStartLocal}
              onChange={(e) => setShellStartLocal(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2"> 
            <Label>Shell Temp DateTime End</Label>
            <Input
              type="datetime-local"
              value={shellEndLocal}
              onChange={(e) => setShellEndLocal(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label>Duration</Label>
            <Input disabled value={durationDisplay} />
            {shellStartLocal && shellEndLocal && durationSeconds == null && (
              <p className="text-sm text-destructive mt-1">
                End must be greater than Start.
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* REMARKS */}
        <div className="grid grid-cols-1 gap-2">
          <Label>Remarks</Label>
          <Textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder=""
            className="min-h-30"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 justify-end">
        <Button type="button" onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save"}
        </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/a_baja/eggstorage")}
            disabled={saving}
          >
            Cancel
          </Button>
          
        </div>
      </CardContent>
    </Card>
  )
}
