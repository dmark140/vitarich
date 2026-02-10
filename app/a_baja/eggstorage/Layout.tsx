"use client";
import { useState, ChangeEvent, useEffect } from "react";
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
import { create } from "domain";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EggStorageForm) => void;
};
 

const initialState: EggStorageForm = {  
//   egg_storage_temp: null,
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

  // Auto-compute duration whenever start or end times change
  useEffect(() => {
    if (form.egg_stemp_start && form.egg_stemp_end) {
      const start = new Date(form.egg_stemp_start);
      const end = new Date(form.egg_stemp_end);
      
      if (end > start) {
        const diffMs = end.getTime() - start.getTime();
        const diffMinutes = Math.round(diffMs / 60000);
        
        setForm((prev) => ({
          ...prev,
          duration: diffMinutes,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          duration: null,
        }));
      }
    } else {
      setForm((prev) => ({
        ...prev,
        duration: null,
      }));
    }
  }, [form.egg_stemp_start, form.egg_stemp_end]);

  /**
   * Generic onChange handler (typed)
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => {
      const parsedValue =
        type === "number"
          ? value === ""
            ? null
            : Number(value)
          : value;

      return {
        ...prev,
        [name]: parsedValue,
      };
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
   
    { label: "Room Temp", name: "room_temp", disable: false, type: "text" },
    { label: "Storage Humidity", name: "egg_sto_humi", disable: false, type: "text" },
    { label: "Egg Shell Temp", name: "egg_shell_temp", disable: false, type: "text" },
    { label: "Egg Shell Temp Date", name: "egg_shell_temp_date", disable: false, type: "date" },
    { label: "Duration (minutes)", name: "duration", disable: true, type: "number" },
    { label: "Remarks", name: "remarks", disable: false, type: "text" },
  ];

 
  return (

    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Egg Storage Management</DialogTitle>
          <DialogDescription>Enter egg storage details</DialogDescription>
        </DialogHeader>

         {/* className="sm:grid grid-cols-2 gap-4" */}
       <div  className="grid gap-1 p-4">  
          {/* Date */}
          {/* <div className="space-y-1">
            <Label>Storage Date</Label>
            <Input
              type="date"
              name="egg_shell_temp_date"
              value={form.egg_shell_temp_date ?? ""}
              onChange={handleChange}
            />
          </div>  */}
          {/* Egg Stemp Start */}
          <div className="space-y-1">
            <Label>Storage Temp Start</Label>
            <Input
              type="datetime-local"
              name="egg_stemp_start"
              value={form.egg_stemp_start ?? ""}
              onChange={handleChange}
            />
          </div>
        {/* Egg Stemp End */}
          <div className="space-y-1">
            <Label>Storage Temp End</Label>
            <Input
              type="datetime-local"
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
                // placeholder={field.name === "duration" ? "Auto-computed" : ""}
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