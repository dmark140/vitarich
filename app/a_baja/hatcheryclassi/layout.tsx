"use client";
import React from 'react'
import { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HatchForm } from "./hatch-form";

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

export default function Layout({
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

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
    setForm(initialState);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hatch Classification</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-1">
            <Label>Date</Label>
            <Input
              type="date"
              name="daterec"
              value={form.daterec ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* BR No */}
          <div className="space-y-1">
            <Label>BR No</Label>
            <Input
              name="br_no"
              value={form.br_no ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Numbers */}
          {[
            { label: "Good Egg", name: "good_egg" },
            { label: "Trans Crack", name: "trans_crack" },
            { label: "Hatch Crack", name: "hatc_crack" },
            { label: "Trans Condemn", name: "trans_condemn" },
            { label: "Hatch Condemn", name: "hatc_condemn" },
            { label: "Thin Shell", name: "thin_shell" },
            { label: "Pee Wee", name: "pee_wee" },
            { label: "Small", name: "small" },
            { label: "Jumbo", name: "jumbo" },
            { label: "Double Yolk", name: "d_yolk" },
            { label: "Total Count", name: "ttl_count" },
          ].map((field) => (
            <div key={field.name} className="space-y-1">
              <Label>{field.label}</Label>
              <Input
                type="number"
                name={field.name}
                value={(form as any)[field.name] ?? ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
