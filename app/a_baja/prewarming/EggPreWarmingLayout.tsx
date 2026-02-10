"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

type Props = {
  open: boolean
  onClose: () => void
}

export default function EggPreWarmingLayout({ open, onClose }: Props) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [duration, setDuration] = useState("")

  // Auto-compute duration whenever start or end times change
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(startTime)
      const end = new Date(endTime)
      
      if (end > start) {
        const diffMs = end.getTime() - start.getTime()
        const diffMinutes = Math.round(diffMs / 60000)
        setDuration(diffMinutes.toString())
      } else {
        setDuration("")
      }
    } else {
      setDuration("")
    }
  }, [startTime, endTime])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Egg Pre-Warming Record</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Egg Reference No.</Label>
              <Input />
            </div>

            <div>
              <Label>Pre-Warming Temp</Label>
              <Input />
            </div>

            <div>
              <Label>Egg Temp</Label>
              <Input />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input 
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <Label>End Time</Label>
              <Input 
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div>
              <Label>Duration (minutes)</Label>
              <Input 
                value={duration}
                onChange={(e) => setDuration(e.target.value)} 
              /> 
            </div>
          </div>

          <div>
            <Label>Remarks</Label>
            <Textarea />
          </div>

          {/* <div className="flex items-center gap-2">
            <Switch />
            <Label>Active</Label>
          </div> */}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}