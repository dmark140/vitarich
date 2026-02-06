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
import { EggStorageForm } from "./egg-form";
import { Separator } from "@/components/ui/separator";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EggStorageForm) => void;
};
 

const initialState: EggStorageForm = { 
  egg_storage_temp:null,
  room_temp: null,
  egg_sto_humi: null,
  egg_stemp_start: null,
  egg_stemp_end: null,
  egg_shell_temp: null,
  egg_shell_temp_date: null,
  duration: null,
  remarks: null,
  is_active: null
};

export default function Layout({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<EggStorageForm>(initialState);

  /**
   * Generic onChange handler (typed)
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const numericFields = [
      "egg_storage_temp",
      "room_temp",
      "egg_sto_humi",
      "egg_stemp_start",
      "egg_stemp_end",
      "egg_shell_temp",
      "egg_shell_temp_date",
      "duration",
      "remarks",
      "is_active",
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
    { label: "Egg Storage Temp", name: "egg_storage_temp", disable: false, type: "text" },
    { label: "Room Temp", name: "room_temp", disable: false, type: "text" },
    { label: "Egg Storage Humidity", name: "egg_sto_humi", disable: false, type: "text" },
    { label: "Egg Stemp Start", name: "egg_stemp_start", disable: false, type: "datetime-local" },
    { label: "Egg Stemp End", name: "egg_stemp_end", disable: false, type: "datetime-local" },
    { label: "Egg Shell Temp", name: "egg_shell_temp", disable: false, type: "text" },
    { label: "Egg Shell Temp Date", name: "egg_shell_temp_date", disable: false, type: "date" },
    { label: "Duration", name: "duration", disable: false, type: "number" },
    { label: "Remarks", name: "remarks", disable: false, type: "text" },
    { label: "Is Active", name: "is_active", disable: false, type: "checkbox" },
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
            <Label>{listofcom[6].label}</Label>
            <Input
              type="date"
              name="egg_shell_temp_date"
              value={form.egg_shell_temp_date ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* Egg Stemp Start */}
          <div className="space-y-1">
            <Label>{listofcom[3].label}</Label>
            <Input
              name="egg_stemp_start"
              value={form.egg_stemp_start ?? ""}
              onChange={handleChange}
            />
          </div>
        {/* Egg Stemp End */}
          <div className="space-y-1">
            <Label>{listofcom[4].label}</Label>
            <Input
              name="egg_stemp_end"
              value={form.egg_stemp_end ?? ""}
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
