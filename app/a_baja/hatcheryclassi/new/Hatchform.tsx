"use client"

import { useEffect, useMemo, useState, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db } from "@/lib/Supabase/supabaseClient"
import { useRouter } from "next/navigation"
import { createHatchClassification, HatchClassificationInsert } from "./api"

type ViewForHatcheryClassi = {
  dr_num: string | null
  doc_date: string | null
  temperature: string | null
  humidity: string | null
  brdr_ref_no: string | null
  sku: string | null
  UoM: string | null
  actual_count: number | null
}

function pad3(n: number) {
  return String(n).padStart(3, "0")
}

function ddmmyyFromYYYYMMDD(dateStr: string) {
  // dateStr expected: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-")
  if (!y || !m || !d) return ""
  return `${d}${m}${y.slice(-2)}`
}

export default function Hatchform() {
  const router = useRouter()

  const [breeders, setBreeders] = useState<ViewForHatcheryClassi[]>([])
  const [saving, setSaving] = useState(false)
  const [refLoading, setRefLoading] = useState(false)

  const [form, setForm] = useState({
    // view-selected
    br_no: "",
    dr_no: "",
    dr_date: "",
    temperature: "",
    sku: "",
    uom: "",
    total_count_view: 0,

    // NEW: classification header fields
    classi_ref_no: "",
    date_classify: "",

    // table numeric fields
    good_egg: null as number | null,
    trans_crack: null as number | null,
    trans_condemn: null as number | null,
    hatc_crack: null as number | null,
    thin_shell: null as number | null,
    hatc_condemn: null as number | null,
    small: null as number | null,
    pee_wee: null as number | null,
    d_yolk: null as number | null,
    jumbo: null as number | null,

    ttl_count: 0,
    discrepancy: 0, // NOT stored in table
  })

  const numericFields = useMemo(
    () => [
      { label: "Good Egg", name: "good_egg", placeholder: "0" },
      { label: "Transport Crack", name: "trans_crack", placeholder: "0" },
      { label: "Transport Condemn", name: "trans_condemn", placeholder: "0" },

      { label: "Hatch Crack", name: "hatc_crack", placeholder: "0" },
      { label: "Thin Shell", name: "thin_shell", placeholder: "0" },
      { label: "Hatch Condemn", name: "hatc_condemn", placeholder: "0" },

      { label: "Small", name: "small", placeholder: "0" },
      { label: "Pee Wee", name: "pee_wee", placeholder: "0" },
      { label: "Double Yolk", name: "d_yolk", placeholder: "0" },

      { label: "Jumbo", name: "jumbo", placeholder: "0" },
    ],
    []
  )

  // load view
  useEffect(() => {
    const loadBreeders = async () => {
      const { data, error } = await db
        .from("viewforhatcheryclassi")
        .select(
          "dr_num,doc_date,temperature,humidity,brdr_ref_no,sku,UoM,actual_count"
        )
        .order("doc_date", { ascending: false })

      if (!error && data) setBreeders(data as any)
      if (error) console.error(error)
    }
    loadBreeders()
  }, [])

  // breeder selected -> auto populate
  const handleBreederChange = (value: string) => {
    const selected = breeders.find((b) => b.brdr_ref_no === value)
    if (!selected) return

    setForm((prev) => ({
      ...prev,
      br_no: selected.brdr_ref_no ?? "",
      dr_no: selected.dr_num ?? "",
      dr_date: selected.doc_date ?? "",
      temperature: selected.temperature ?? "",
      sku: selected.sku ?? "",
      uom: selected.UoM ?? "",
      total_count_view: Number(selected.actual_count ?? 0),
    }))
  }

  // handle inputs (numbers + date_classify)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    setForm((prev) => {
      const updated: any = { ...prev }

      if (type === "number") updated[name] = value === "" ? null : Number(value)
      else updated[name] = value

      const total = numericFields.reduce(
        (sum, f) => sum + Number(updated[f.name] || 0),
        0
      )
      updated.ttl_count = total
      updated.discrepancy = Number(updated.total_count_view || 0) - total

      return updated
    })
  }

  // generate Classification Ref No when br_no + date_classify are ready
  useEffect(() => {
    const generate = async () => {
      if (!form.br_no || !form.date_classify) {
        setForm((p) => ({ ...p, classi_ref_no: "" }))
        return
      }

      setRefLoading(true)
      try {
        // count how many classifications exist for that date
        // (auto-increment "per day")
        const { count, error } = await db
          .from("hatch_classification")
          .select("id", { count: "exact", head: true })
          .eq("date_classify", form.date_classify)

        if (error) throw error

        const seq = Number(count || 0) + 1
        const datePart = ddmmyyFromYYYYMMDD(form.date_classify)
        const ref = `${form.br_no}-${datePart}-CL${pad3(seq)}`

        setForm((p) => ({ ...p, classi_ref_no: ref }))
      } catch (err) {
        console.error("Failed to generate ref no:", err)
        // keep UI usable even if ref generation fails
        setForm((p) => ({ ...p, classi_ref_no: "" }))
      } finally {
        setRefLoading(false)
      }
    }

    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.br_no, form.date_classify])

  const handleSave = async () => {
    // required checks
    if (!form.br_no || form.br_no.trim() === "") {
      alert("Please select Breeder Ref. No.")
      return
    }
    if (!form.date_classify) {
      alert("Please fill Date Classify.")
      return
    }
    if (Number(form.ttl_count) !== Number(form.total_count_view)) {
      alert("Total Classify must be equal to Total Count.")
      return
    }

    try {
      setSaving(true)

      const payload: HatchClassificationInsert = {
        created_at: new Date().toISOString(),

        // NEW fields (make sure these columns exist in Supabase)
        classi_ref_no: form.classi_ref_no || null,
        daterec: form.date_classify || null,

        br_no: form.br_no,

        good_egg: form.good_egg,
        trans_crack: form.trans_crack,
        trans_condemn: form.trans_condemn,
        hatc_crack: form.hatc_crack,
        thin_shell: form.thin_shell,
        hatc_condemn: form.hatc_condemn,
        small: form.small,
        pee_wee: form.pee_wee,
        d_yolk: form.d_yolk,
        jumbo: form.jumbo,

        ttl_count: form.ttl_count,
        is_active: true,
      }

      await createHatchClassification(payload)
      router.push("/a_baja/hatcheryclassi")
    } catch (err: any) {
      console.error(err)
      alert(err?.message ?? "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl ml-0 p-6 space-y-2">
      <h1 className="text-2xl font-bold">Hatch Classification</h1>

      {/* TOP CARD (Breeder + view fields) */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="space-y-1 max-w-sm">
            <Label>Breeder Ref. No.</Label>
            <Select onValueChange={handleBreederChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Breeder Ref No" />
              </SelectTrigger>
              <SelectContent>
                {breeders.map((b, i) => (
                  <SelectItem key={i} value={b.brdr_ref_no ?? ""}>
                    {b.brdr_ref_no}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <DisabledField label="DR No." value={form.dr_no} />
            <DisabledField label="DR Date" value={form.dr_date} />
            <DisabledField label="Temperature" value={form.temperature} />
            <DisabledField label="SKU" value={form.sku} />
            <DisabledField label="UOM" value={form.uom} />
            <DisabledField label="Total Count" value={form.total_count_view} />
          </div>
        </CardContent>
      </Card>

      {/* SECOND CARD (Classification inputs) */}
      <Card>
        <CardContent className="pt-2 space-y-2">
          {/* header row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-1">
              <Label>Classification Ref. No.</Label>
              <Input
                value={
                  refLoading ? "Generating..." : form.classi_ref_no ?? ""
                }
                disabled
              />
            </div>

            <div className="space-y-1 md:justify-self-end md:w-72">
              <Label>Date Classify</Label>
              <Input
                type="date"
                name="date_classify"
                value={form.date_classify}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* fields layout like image */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Good Egg (single wide row-left feel) */}
            <div className="md:col-span-1">
              <NumberField
                label="Good Egg"
                name="good_egg"
                placeholder="0"
                form={form}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2" />

            {/* Transport Crack / Condemn */}
            <NumberField
              label="Transport Crack"
              name="trans_crack"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />
            <NumberField
              label="Transport Condemn"
              name="trans_condemn"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />
            <div />

            {/* Hatch Crack / Thin Shell / Hatch Condemn */}
            <NumberField
              label="Hatch Crack"
              name="hatc_crack"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />
            <NumberField
              label="Thin Shell"
              name="thin_shell"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />
            <NumberField
              label="Hatch Condemn"
              name="hatc_condemn"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />

            {/* Small / Pee Wee / Double Yolk */}
            <NumberField
              label="Small"
              name="small"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />
            <NumberField
              label="Pee Wee"
              name="pee_wee"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />
            <NumberField
              label="Double Yolk"
              name="d_yolk"
              placeholder="0"
              form={form}
              onChange={handleChange}
            />

            {/* Jumbo */}
            <div className="md:col-span-1">
              <NumberField
                label="Jumbo"
                name="jumbo"
                placeholder="0"
                form={form}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <NumberField label="Total Classify" name="ttl_count" form={form} disabled />
            <NumberField label="Discrepancy" name="discrepancy" form={form} disabled />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/a_baja/hatcheryclassi")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DisabledField({ label, value }: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value ?? ""} disabled />
    </div>
  )
}

function NumberField({
  label,
  name,
  placeholder,
  form,
  onChange,
  disabled = false,
}: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type="number"
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        value={form[name] ?? ""}
        onChange={onChange}
      />
    </div>
  )
}
