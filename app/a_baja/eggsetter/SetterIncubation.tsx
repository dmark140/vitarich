"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
export default function EggSettingForm() {
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Egg Setting Record</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
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
          <Input disabled placeholder="AUTO" />
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
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pointed Down">Pointed Down</SelectItem>
              <SelectItem value="Pointed Up">Pointed Up</SelectItem>
              <SelectItem value="Horizontal">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="md:col-span-3 flex justify-end gap-2 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Record</Button>
        </div>

      </CardContent>
    </Card>
  )
}
