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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Egg Setting Record</DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Reference Number */}
            <div>
              <Label>Reference Number</Label>
              <Input disabled placeholder="AUTO" />
            </div>

            {/* Setting Date */}
            <div>
              <Label>Setting Date</Label>
              <Input type="datetime-local" disabled />
            </div>

            {/* Farm Source */}
            <div>
              <Label>Farm Source</Label>
              <Input disabled />
            </div>

            {/* Setter Machine */}
            <div>
              <Label>Setter Machine ID</Label>
              <Input />
            </div>

            {/* Total Egg Set */}
            <div>
              <Label>Total Number of Egg Set</Label>
              <Input type="number" />
            </div>

            {/* Setter Temp */}
            <div>
              <Label>Setter Temperature (°C)</Label>
              <Input type="number" step="0.01" />
            </div>

            {/* Setter Humidity */}
            <div>
              <Label>Setter Humidity (%)</Label>
              <Input type="number" step="0.01" />
            </div>

            {/* Turning Interval */}
            <div>
              <Label>Turning Interval (mins)</Label>
              <Input type="number" />
            </div>

            {/* Turning Angle */}
            <div>
              <Label>Turning Angle (°)</Label>
              <Input type="number" step="0.01" />
            </div>

            {/* Incubation Duration */}
            <div>
              <Label>Incubation Duration (days)</Label>
              <Input disabled placeholder="AUTO" />
            </div>

            {/* Egg Shell Temp */}
            <div>
              <Label>Egg Shell Temperature (°C)</Label>
              <Input type="number" step="0.01" />
            </div>

            {/* Egg Shell Temp Date */}
            <div>
              <Label>Egg Shell Temp Date & Time</Label>
              <Input type="datetime-local" />
            </div>

            {/* Orientation */}
            <div>
              <Label>Egg Shell Orientation</Label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="">Select orientation</option>
                <option value="Pointed Down">Pointed Down</option>
                <option value="Pointed Up">Pointed Up</option>
                <option value="Horizontal">Horizontal</option>
              </select>
            </div>

            {/* Actions */}
            <div className="md:col-span-3 flex justify-end mt-4">
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button>Save</Button>
              </DialogFooter>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
