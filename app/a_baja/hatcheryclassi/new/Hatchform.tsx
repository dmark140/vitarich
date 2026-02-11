"use client";

import { useEffect, useState, ChangeEvent } from "react"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { db } from "@/lib/Supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function Hatchform() {
const router = useRouter(); // Add this hook
  const [breeders, setBreeders] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    br_no: "",
    dr_no: "",
    dr_date: "",
    temperature: "",
    sku: "",
    uom: "",
    total_count_view: 0,

    good_egg: null,
    trans_crack: null,
    hatc_crack: null,
    trans_condemn: null,
    hatc_condemn: null,
    thin_shell: null,
    pee_wee: null,
    small: null,
    jumbo: null,
    d_yolk: null,
    ttl_count: 0,
    discrepancy: 0,
  });

  const numericFields = [
  "Good_Egg",
  "Transoprt_Crack",
  "Hatch_Crack",
  "Transoprt_Condemn",
  "Hatch_Condemn",
  "Thin_Shell",
  "Pee_Wee",
  "Small",
  "Jumbo",
  "Double_Yolk"
];

  // 🔥 LOAD VIEW DATA
  useEffect(() => {
    const loadBreeders = async () => {
      const { data, error } = await db
        .from("viewforhatcheryclassi")
        .select("*")
        .order("doc_date", { ascending: false });

      if (!error && data) {
        setBreeders(data);
      }
    };

    loadBreeders();
  }, []);

  // 🔥 WHEN BREEDER SELECTED
  const handleBreederChange = (value: string) => {
    const selected = breeders.find(
      (b) => b.brdr_ref_no === value
    );

    if (!selected) return;

    setForm((prev: any) => ({
      ...prev,
      br_no: selected.brdr_ref_no,
      dr_no: selected.dr_num,
      dr_date: selected.doc_date,
      temperature: selected.temperature,
      sku: selected.sku,
      uom: selected.UoM,
      total_count_view: selected.actual_count,
    }));
  };

  // 🔥 CLASSIFICATION INPUT
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev: any) => {
      const updated = {
        ...prev,
        [name]: value === "" ? null : Number(value),
      };

      const total = numericFields.reduce((sum, key) => {
        return sum + Number(updated[key] || 0);
      }, 0);

      updated.ttl_count = total;
      updated.discrepancy =
        (updated.total_count_view || 0) - total;

      return updated;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Hatch Classification
      </h1>

      {/* ================= VIEW SECTION ================= */}
      <Card>
        {/* <CardHeader className="bg-muted">
          <CardTitle>
            This data from viewforhatcheryclassi
          </CardTitle>
        </CardHeader> */}

        <CardContent className="space-y-6 pt-6">

          {/* Breeder Dropdown */}
          <div className="space-y-2">
            <Label>Breeder Ref. No.</Label>
            <Select onValueChange={handleBreederChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Breeder Ref No" />
              </SelectTrigger>
              <SelectContent>
                {breeders.map((b) => (
                  <SelectItem
                    key={b.brdr_ref_no}
                    value={b.brdr_ref_no}
                  >
                    {b.brdr_ref_no}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-6">
            <DisabledField label="DR No." value={form.dr_no} />
            <DisabledField label="DR Date" value={form.dr_date} />
            <DisabledField label="Temperature" value={form.temperature} />
            <DisabledField label="SKU" value={form.sku} />
            <DisabledField label="UOM" value={form.uom} />
            <DisabledField label="Total Count" value={form.total_count_view} />
          </div>
        </CardContent>
      </Card>

      {/* ================= CLASSIFICATION ================= */}
      <Card>
        {/* <CardHeader className="">
          <CardTitle>
            Hatch Classification
          </CardTitle>
        </CardHeader> */}

        <CardContent className="pt-6 space-y-6">

          <div className="grid grid-cols-3 gap-6">
            {numericFields.map((field) => (
              <NumberField
                key={field}
                label={field.replace("_", " ")}
                name={field}
                form={form}
                onChange={handleChange}
              />
            ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
            <NumberField
              label="Total Classify"
              name="ttl_count"
              form={form}
              disabled
            />

            <NumberField
              label="Discrepancy"
              name="discrepancy"
              form={form}
              disabled
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button>Save</Button>
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
  );
}

/* ================= Reusable ================= */

function DisabledField({ label, value }: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value ?? ""} disabled />
    </div>
  );
}

function NumberField({
  label,
  name,
  form,
  onChange,
  disabled = false,
}: any) {
  return (
    <div className="space-y-1">
      <Label className="capitalize">{label}</Label>
      <Input
        type="number"
        name={name}
        disabled={disabled}
        value={form[name] ?? ""}
        onChange={onChange}
      />
    </div>
  );
}
