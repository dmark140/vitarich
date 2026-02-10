"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function HatcheryProcessForm() {
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [duration, setDuration] = useState("")

  // Auto-compute duration whenever start or end times change
  useEffect(() => {
    if (start && end) {
      const startTime = new Date(start)
      const endTime = new Date(end)
      
      if (endTime > startTime) {
        const diffMs = endTime.getTime() - startTime.getTime()
        const diffMinutes = Math.round(diffMs / 60000)
        setDuration(diffMinutes.toString())
      } else {
        setDuration("")
      }
    } else {
      setDuration("")
    }
  }, [start, end])

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>Egg Hatchery Process</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Egg Reference</Label>
            <Input placeholder="EGG-REF-001" />
          </div>

          <div>
            <Label>Farm Source</Label>
            <Input placeholder="Farm A" />
          </div>

          <div>
            <Label>Date Recorded</Label>
            <Input type="date" />
          </div>
        </div>

        <Separator />

        {/* MACHINE & ENVIRONMENT */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Machine No</Label>
            <Input type="number" />
          </div>

          <div>
            <Label>Hatch Temperature (°C)</Label>
            <Input placeholder="37.5" />
          </div>

          <div>
            <Label>Hatch Humidity (%)</Label>
            <Input placeholder="65" />
          </div>

          <div>
            <Label>Hatch Window (hrs)</Label>
            <Input type="number" />
          </div>
        </div>

        <Separator />

        {/* HATCH TIMING */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Hatch Start Time</Label>
            <Input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div>
            <Label>Hatch End Time</Label>
            <Input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>

          <div>
            <Label>Duration (mins)</Label>
            <Input 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
            /> 
          </div>
        </div>

        <Separator />

        {/* PRODUCTION SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <Label>Total Eggs</Label>
            <Input type="number" />
          </div>

          {/* <div className="flex items-center gap-3 mt-6">
            <Switch />
            <Label>Active Batch</Label>
          </div> */}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  )
}