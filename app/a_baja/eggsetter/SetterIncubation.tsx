"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type EggSettingFormProps = {
  open: boolean
  onClose: () => void
}

export default function EggSettingForm({
  open,
  onClose,
}: EggSettingFormProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Egg Setting Record</DialogTitle>
        </DialogHeader>
         <Separator className="border my-1" />
            <div className="space-y-4 p-4">
            {/* Reference Number */}
            <div className="space-y-1">
            <Label>Reference Number</Label>
            <Input disabled placeholder="AUTO" />
            </div>

            {/* Setting Date */}
            <div className="space-y-1">
            <Label>Setting Date</Label>
            <Input type="datetime-local" disabled />
            </div>

            {/* Farm Source */}
            <div className="space-y-1">
            <Label>Farm Source</Label>
            <Input disabled />
            </div>

            {/* Setter Machine */}
            <div className="space-y-1">
            <Label>Setter Machine ID</Label>
            <Input />
            </div>

            {/* Two Column Layout: Total Egg Set & Incubation Duration */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
            <Label>Total Number of Egg Set</Label>
            <Input type="number" />
            </div>
            <div className="space-y-1">
            <Label>Incubation Duration (days)</Label>
            {/* <Input disabled placeholder="AUTO" /> */}
             <Input type="number" />
            </div>
            </div>

            {/* Two Column Layout: Setter Temp & Egg Shell Temp */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
            <Label>Setter Temperature (°C)</Label>
            <Input type="number" step="0.01" />
            </div>
            <div className="space-y-1">
            <Label>Egg Shell Temperature (°C)</Label>
            <Input type="number" step="0.01" />
            </div>
            </div>

            {/* Two Column Layout: Setter Humidity & Egg Shell Temp Date */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
            <Label>Setter Humidity (%)</Label>
            <Input type="number" step="0.01" />
            </div>
            <div className="space-y-1">
            <Label>Egg Shell Temp Date & Time</Label>
            <Input type="datetime-local" />
            </div>
            </div>

            {/* Two Column Layout: Turning Interval & Egg Shell Orientation */}
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
            <Label>Turning Interval (mins)</Label>
            <Input type="number" />
            </div>
            <div className="space-y-1">
            <Label>Egg Shell Orientation</Label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>Pointed Down</option>
              <option>Pointed Up</option>
              <option>Horizontal</option>
            </select>
            </div>
            </div>

            {/* Turning Angle - Full Width */}
            <div className="space-y-1">
            <Label>Turning Angle (°)</Label>
            <Input type="number" step="0.01" />
            </div>

            {/* Actions */}
            <DialogFooter className="pt-4"> 
              <Button>Save</Button>
              <Button variant="outline" onClick={onClose}>
              Cancel
              </Button>
            </DialogFooter>
            </div>

  
      </DialogContent>
    </Dialog>
  )
}
