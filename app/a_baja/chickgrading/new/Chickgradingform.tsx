"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

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

import {
  ChickGradingProcess,
  createChickGradingProcess,
  getChickGradingProcessById,
  listEggReferences,
  updateChickGradingProcess,
} from "./api"

function n(v: any) {
  const x = Number(v)
  return Number.isFinite(x) ? x : 0
}

function fmtDT(v?: string | null) {
  if (!v) return ""
  const d = new Date(v)
  const pad = (x: number) => String(x).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`
}

export default function Chickgradingform() {
  const router = useRouter()
  const sp = useSearchParams()
  const idParam = sp.get("id")
  const editId = idParam ? Number(idParam) : null

  const [saving, setSaving] = useState(false)
  const [eggRefs, setEggRefs] = useState<string[]>([])

  const [form, setForm] = useState<Partial<ChickGradingProcess>>({
    egg_ref_no: "",
    batch_code: "",
    grading_datetime: new Date().toISOString(),
    grading_personnel: "",
    class_a: 0,
    class_b: 0,
    class_a_junior: 0,
    class_c: 0, // (optional UI-only, ignore if not used)
    cull_chicks: 0,
    dead_chicks: 0,
    infertile: 0,
    dead_germ: 0,
    live_pip: 0,
    dead_pip: 0,
    unhatched: 0,
    rotten: 0,

    // generated fields (read-only)
    total_chicks: 0,
    good_quality_chicks: 0,
    quality_grade_rate: null,
    cull_rate: null,
  })

  // load dropdown
  useEffect(() => {
    ;(async () => {
      try {
        setEggRefs(await listEggReferences())
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  // load for edit
  useEffect(() => {
    if (!editId) return
    ;(async () => {
      try {
        const rec = await getChickGradingProcessById(editId)
        setForm({
          ...rec,
          egg_ref_no: rec.egg_ref_no ?? "",
          grading_personnel: rec.grading_personnel ?? "",
        })
      } catch (e) {
        console.error(e)
      }
    })()
  }, [editId])

  // UI-only: compute total for display before save (your DB also computes)
  const totalChicksPreview = useMemo(() => {
    return (
      n(form.class_a) +
      n(form.class_b) +
      n(form.class_a_junior) +
      n((form as any).class_c) +
      n(form.cull_chicks) +
      n(form.dead_chicks) +
      n(form.infertile) +
      n(form.dead_germ) +
      n(form.live_pip) +
      n(form.dead_pip) +
      n(form.unhatched) +
      n(form.rotten)
    )
  }, [form])

  const goodQualityPreview = useMemo(() => {
    return n(form.class_a) + n(form.class_b) + n(form.class_a_junior) + n((form as any).class_c)
  }, [form])

  const qualityRatePreview = useMemo(() => {
    const t = totalChicksPreview
    if (t <= 0) return ""
    return ((goodQualityPreview / t) * 100).toFixed(2)
  }, [totalChicksPreview, goodQualityPreview])

  const cullRatePreview = useMemo(() => {
    const t = totalChicksPreview
    if (t <= 0) return ""
    return ((n(form.cull_chicks) / t) * 100).toFixed(2)
  }, [totalChicksPreview, form.cull_chicks])

  async function onSave() {
    try {
      setSaving(true)

      // Only send real DB columns (no generated columns, no UI-only class_c)
      const payload: any = {
        egg_ref_no: form.egg_ref_no?.trim() || null,
        batch_code: (form.batch_code ?? "").trim(),
        grading_datetime: form.grading_datetime ?? new Date().toISOString(),
        grading_personnel: form.grading_personnel?.trim() || null,

        class_a: n(form.class_a),
        class_b: n(form.class_b),
        class_a_junior: n(form.class_a_junior),
        cull_chicks: n(form.cull_chicks),
        dead_chicks: n(form.dead_chicks),
        infertile: n(form.infertile),
        dead_germ: n(form.dead_germ),
        live_pip: n(form.live_pip),
        dead_pip: n(form.dead_pip),
        unhatched: n(form.unhatched),
        rotten: n(form.rotten),

        chick_room_temperature:
          form.chick_room_temperature === null || form.chick_room_temperature === undefined
            ? null
            : Number(form.chick_room_temperature),
      }

      if (editId) await updateChickGradingProcess(editId, payload)
      else await createChickGradingProcess(payload)

      router.push("/a_baja/chickgrading")
      router.refresh()
    } catch (e: any) {
      console.error(e)
      alert(e?.message ?? "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle>Chick grading process</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4 space-y-4">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Egg Reference No.</Label>
              <Select
                value={form.egg_ref_no ?? ""}
                onValueChange={(v) => setForm((p) => ({ ...p, egg_ref_no: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Egg Ref. No." />
                </SelectTrigger>
                <SelectContent>
                  {eggRefs.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Batch code</Label>
              <Input
                value={form.batch_code ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, batch_code: e.target.value }))}
                placeholder="Enter batch code"
              />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Grading date & time</Label>
              <Input value={fmtDT(form.grading_datetime)} disabled />
            </div>

            <div className="space-y-1">
              <Label>Total chicks</Label>
              <Input
                value={
                  form.total_chicks !== null && form.total_chicks !== undefined
                    ? String(form.total_chicks)
                    : String(totalChicksPreview)
                }
                disabled
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Middle grid like photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Quality: class A</Label>
                <Input
                  type="number"
                  value={String(form.class_a ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, class_a: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-1">
                <Label>Quality: class A junior</Label>
                <Input
                  type="number"
                  value={String(form.class_a_junior ?? 0)}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, class_a_junior: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Infertile</Label>
                <Input
                  type="number"
                  value={String(form.infertile ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, infertile: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-1">
                <Label>Live pip</Label>
                <Input
                  type="number"
                  value={String(form.live_pip ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, live_pip: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Cull chicks</Label>
                <Input
                  type="number"
                  value={String(form.cull_chicks ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, cull_chicks: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-1">
                <Label>Unhatched</Label>
                <Input
                  type="number"
                  value={String(form.unhatched ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, unhatched: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Quality: class B</Label>
                <Input
                  type="number"
                  value={String(form.class_b ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, class_b: Number(e.target.value) }))}
                />
              </div>

              {/* The photo shows class C, but your schema doesn't have it.
                  If you want it, add column class_c integer null. */}
              <div className="space-y-1">
                <Label>Quality: class C</Label>
                <Input
                  type="number"
                  value={String((form as any).class_c ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...(p as any), class_c: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Dead chicks</Label>
                <Input
                  type="number"
                  value={String(form.dead_chicks ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, dead_chicks: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-1">
                <Label>Dead germ</Label>
                <Input
                  type="number"
                  value={String(form.dead_germ ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, dead_germ: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Dead pip</Label>
                <Input
                  type="number"
                  value={String(form.dead_pip ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, dead_pip: Number(e.target.value) }))}
                />
              </div>

              <div className="space-y-1">
                <Label>Rotten</Label>
                <Input
                  type="number"
                  value={String(form.rotten ?? 0)}
                  onChange={(e) => setForm((p) => ({ ...p, rotten: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left bottom */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Good quality chicks</Label>
              <Input
                value={
                  form.good_quality_chicks !== null && form.good_quality_chicks !== undefined
                    ? String(form.good_quality_chicks)
                    : String(goodQualityPreview)
                }
                disabled
              />
            </div>

            <div className="space-y-1">
              <Label>Quality grade rate %</Label>
              <Input
                value={
                  form.quality_grade_rate !== null && form.quality_grade_rate !== undefined
                    ? String(form.quality_grade_rate)
                    : qualityRatePreview
                }
                disabled
              />
            </div>
          </div>

          {/* Right bottom */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Grading personnel</Label>
              <Input
                value={form.grading_personnel ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, grading_personnel: e.target.value }))}
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-1">
              <Label>Cull rate %</Label>
              <Input
                value={
                  form.cull_rate !== null && form.cull_rate !== undefined
                    ? String(form.cull_rate)
                    : cullRatePreview
                }
                disabled
              />
            </div>
          </div>
        </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
            <Button
                onClick={onSave}
                disabled={saving}
                className="w-[10%] justify-left"
            >
                {saving ? "Saving..." : "Save"}
            </Button>

            <Button
                type="button"
                variant="secondary"
               className="w-[10%] justify-left"
                onClick={() => router.push("/a_baja/chickgrading")}
            >
                Cancel
            </Button>
            </div>`
      </CardContent>
    </Card>
  )
}
