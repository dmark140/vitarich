"use client";

import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/Supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { createHatchClassification, HatchClassificationInsert } from "./api";

type ViewForHatcheryClassi = {
  dr_num: string | null;
  doc_date: string | null;
  temperature: string | null;
  humidity: string | null;
  brdr_ref_no: string | null;
  sku: string | null;
  UoM: string | null; // view column
  actual_count: number | null;
};

export default function Hatchform() {
  const router = useRouter();

  const [breeders, setBreeders] = useState<ViewForHatcheryClassi[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    // view-selected
    br_no: "",
    dr_no: "",
    dr_date: "",
    temperature: "",
    sku: "",
    uom: "",
    total_count_view: 0,

    // table fields
    daterec: "",
    good_egg: null as number | null,
    trans_crack: null as number | null,
    hatc_crack: null as number | null,
    trans_condemn: null as number | null,
    hatc_condemn: null as number | null,
    thin_shell: null as number | null,
    pee_wee: null as number | null,
    small: null as number | null,
    jumbo: null as number | null,
    d_yolk: null as number | null,

    ttl_count: 0,
    discrepancy: 0, // NOT stored in table
  });

  // ✅ MUST match your Supabase columns
  const numericFields = useMemo(
    () => [
      { label: "Transport Crack", name: "trans_crack",placeholder:"0" },
      { label: "Good Egg", name: "good_egg",placeholder:"0" },
      { label: "Transport Condemn", name: "trans_condemn",placeholder:"0" },
      { label: "Hatch Crack", name: "hatc_crack",placeholder:"0" },
      { label: "Thin Shell", name: "thin_shell",placeholder:"0" },
      { label: "Hatch Condemn", name: "hatc_condemn",placeholder:"0" },
      { label: "Small", name: "small",placeholder:"0" },
      { label: "Pee Wee", name: "pee_wee",placeholder:"0" },
      { label: "Double Yolk", name: "d_yolk",placeholder:"0" },
      { label: "Jumbo", name: "jumbo",placeholder:"0" },
    ],
    []
  );

  // load view
  useEffect(() => {
    const loadBreeders = async () => {
      const { data, error } = await db
        .from("viewforhatcheryclassi")
        .select("dr_num,doc_date,temperature,humidity,brdr_ref_no,sku,UoM,actual_count")
        .order("doc_date", { ascending: false });

      if (!error && data) setBreeders(data as any);
      if (error) console.error(error);
    };
    loadBreeders();
  }, []);

  // breeder selected -> auto populate
  const handleBreederChange = (value: string) => {
    const selected = breeders.find((b) => b.brdr_ref_no === value);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      br_no: selected.brdr_ref_no ?? "",
      dr_no: selected.dr_num ?? "",
      dr_date: selected.doc_date ?? "",
      temperature: selected.temperature ?? "",
      sku: selected.sku ?? "",
      uom: selected.UoM ?? "",
      total_count_view: Number(selected.actual_count ?? 0),
    }));
  };

  // classification inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setForm((prev) => {
      const updated: any = { ...prev };

      if (type === "number") updated[name] = value === "" ? null : Number(value);
      else updated[name] = value;

      const total = numericFields.reduce((sum, f) => sum + Number(updated[f.name] || 0), 0);
      updated.ttl_count = total;
      updated.discrepancy = Number(updated.total_count_view || 0) - total;

      return updated;
    });
  };

  const handleSave = async () => {
    
      if (!form.br_no || form.br_no.trim() === "") {
        alert("Please select Breeder Ref. No.");
        return;
      }
      if (Number(form.ttl_count) !== Number(form.total_count_view)) {
          alert("Total Classify must be equal to Total Count.");
          return;
        }
      try {
      setSaving(true);

      const payload: HatchClassificationInsert = {
        created_at: new Date().toISOString(), // ✅ add
        daterec: form.daterec ? form.daterec : null,
        br_no: form.br_no,

        good_egg: form.good_egg,
        trans_crack: form.trans_crack,
        hatc_crack: form.hatc_crack,
        trans_condemn: form.trans_condemn,
        hatc_condemn: form.hatc_condemn,
        thin_shell: form.thin_shell,
        pee_wee: form.pee_wee,
        small: form.small,
        jumbo: form.jumbo,
        d_yolk: form.d_yolk,

        ttl_count: form.ttl_count,
        is_active: true,
      };

      await createHatchClassification(payload);

      router.push("/a_baja/hatcheryclassi"); // back to list
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl ml-0 p-6 space-y-4">
      <h1 className="text-2xl font-bold">Hatch Classification</h1>

      {/* VIEW SECTION */}
      <Card>
        <CardContent className="space-y-2 pt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <Label>Breeder Ref. No.</Label>
              <Select onValueChange={handleBreederChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Breeder Ref No" />
                </SelectTrigger>
                <SelectContent>
                  {breeders.map((b,i) => (
                    <SelectItem key={i} value={b.brdr_ref_no ?? ""}>
                      {b.brdr_ref_no}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Date Received</Label>
              <Input type="date" name="daterec" value={form.daterec} onChange={handleChange} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-2">
            <DisabledField label="DR No." value={form.dr_no} />
            <DisabledField label="DR Date" value={form.dr_date} />
            <DisabledField label="Temperature" value={form.temperature} />
            <DisabledField label="SKU" value={form.sku} />
            <DisabledField label="UOM" value={form.uom} />
            <DisabledField label="Total Count" value={form.total_count_view} />
          </div>
        </CardContent>
      </Card>

      {/* CLASSIFICATION */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {numericFields.map((f) => (
              <NumberField key={f.name} label={f.label} name={f.name} placeholder={f.placeholder} form={form} onChange={handleChange} />
            ))}
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Total Classify" name="ttl_count" form={form} disabled />
            <NumberField label="Discrepancy" name="discrepancy" form={form} disabled />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={() => router.push("/a_baja/hatcheryclassi")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DisabledField({ label, value }: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value ?? ""} disabled />
    </div>
  );
}

function NumberField({ label, name, form, onChange, disabled = false }: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type="number" name={name} disabled={disabled} value={form[name] ?? ""} onChange={onChange} />
    </div>
  );
}
