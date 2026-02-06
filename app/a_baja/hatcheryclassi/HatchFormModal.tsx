"use client";

import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HatchForm } from "./hatch-form";
import { Separator } from "@/components/ui/separator";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HatchForm) => void;
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

export default function HatchFormModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<HatchForm>(initialState);

  /**
   * Generic onChange handler (typed)
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
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
        if (v === null || v === "") return sum + 0;
        return sum + Number(v || 0);
      }, 0);

      updated.ttl_count = ttl;

      return updated;
    });
  };

  const handleSubmit = () => {
    onSubmit(form);
    console.log(form);
    onClose();
    setForm(initialState);
     console.log(initialState);
  };

  const listofcom = [ 
    { label: "Transport Crack", name: "trans_crack", disable: false, type: "number" },
    { label: "Good Egg", name: "good_egg", disable: false, type: "number" },
    { label: "Transport Condemn", name: "trans_condemn", disable: false, type: "number" },
    { label: "Hatch Crack", name: "hatc_crack", disable: false, type: "number" },
    { label: "Thin Shell", name: "thin_shell", disable: false, type: "number" },
    { label: "Hatch Condemn", name: "hatc_condemn", disable: false, type: "number" },
    { label: "Small", name: "small", disable: false, type: "number" },
    { label: "Pee Wee", name: "pee_wee", disable: false, type: "number" },
    { label: "Double Yolk", name: "d_yolk", disable: false, type: "number" }, 
    { label: "Jumbo", name: "jumbo", disable: false, type: "number" },
    { label: "Total Count", name: "ttl_count", disable: true, type: "number" },
    // { label: "Is Active", name: "is_active", disable: false, type: "checkbox" },
  ];
 
  return (

    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hatch Classification</DialogTitle>
          <DialogDescription>Enter hatch classification details</DialogDescription>
        </DialogHeader>

         <Separator className="border my-4" /> 
         {/* className="grid grid-cols-2 gap-4" */}
       <div  className="sm:grid grid-cols-2 gap-4">  
          {/* Date */}
          <div className="space-y-1">
            <Label>Date Received </Label>
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
              value={form.br_no ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Numbers */}
            {listofcom.map((field, i) => (
            <div key={field.name} className="space-y-1">
              <Label>{field.label}</Label>
              <Input
                type={field.type}
                name={field.name}
                disabled={field.disable}
                value={(form as any)[field.name] ?? ""}
                // checked={field.type === "checkbox" && field.name==="is_active" ? (form as any)[field.name] : undefined}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
      
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
