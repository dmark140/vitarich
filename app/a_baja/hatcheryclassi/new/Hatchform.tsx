"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type HatchForm = {
  daterec: string | null;
  br_no: string;
  good_egg: number | null;
  trans_crack: number | null;
  hatc_crack: number | null;
  trans_condemn: number | null;
  hatc_condemn: number | null;
  thin_shell: number | null;
  pee_wee: number | null;
  small: number | null;
  jumbo: number | null;
  d_yolk: number | null;
  ttl_count: number | null;
  is_active: boolean;
};

const initialState: HatchForm = {
  daterec: null,
  br_no: "",
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
  ttl_count: null,
  is_active: true,
};

export default function Hatchfrom() {
  const [form, setForm] = useState<HatchForm>(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    const numericFields = [
      "trans_crack",
      "good_egg",
      "trans_condemn",
      "hatc_crack",
      "thin_shell",
      "hatc_condemn",
      "small",
      "pee_wee",
      "d_yolk",
      "jumbo",
    ];

    setForm((prev) => {
      const parsedValue =
        type === "number"
          ? value === ""
            ? null
            : Number(value)
          : value;

      const updated = {
        ...prev,
        [name]: parsedValue,
      } as any;

      const ttl = numericFields.reduce((sum, key) => {
        const v = updated[key];
        if (v === null || v === "") return sum;
        return sum + Number(v || 0);
      }, 0);

      updated.ttl_count = ttl;

      return updated;
    });
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", form);
    // TODO: call API here
    setForm(initialState);
  };

  const listofcom = [
    { label: "Transport Crack", name: "trans_crack", disable: false },
    { label: "Good Egg", name: "good_egg", disable: false },
    { label: "Transport Condemn", name: "trans_condemn", disable: false },
    { label: "Hatch Crack", name: "hatc_crack", disable: false },
    { label: "Thin Shell", name: "thin_shell", disable: false },
    { label: "Hatch Condemn", name: "hatc_condemn", disable: false },
    { label: "Small", name: "small", disable: false },
    { label: "Pee Wee", name: "pee_wee", disable: false },
    { label: "Double Yolk", name: "d_yolk", disable: false },
    { label: "Jumbo", name: "jumbo", disable: false },
    { label: "Total Count", name: "ttl_count", disable: true },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Hatch Classification</h1>
      <p className="text-muted-foreground">
        Enter hatch classification details
      </p>

      <Separator className="my-6" />

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-1">
          <Label>Date Received</Label>
          <Input
            type="date"
            name="daterec"
            value={form.daterec ?? ""}
            onChange={handleChange}
          />
        </div>

        {/* BR No */}
        <div className="space-y-1">
          <Label>Breeder Ref. No.</Label>
          <Input
            name="br_no"
            value={form.br_no}
            onChange={handleChange}
          />
        </div>

        {/* Dynamic Fields */}
        {listofcom.map((field) => (
          <div key={field.name} className="space-y-1">
            <Label>{field.label}</Label>
            <Input
              type="number"
              name={field.name}
              disabled={field.disable}
              value={(form as any)[field.name] ?? ""}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Button onClick={handleSubmit}>Save</Button>
        <Button
          variant="outline"
          onClick={() => setForm(initialState)}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
