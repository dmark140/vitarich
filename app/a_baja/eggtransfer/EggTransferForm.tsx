"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

type EggTransferFormProps = {
  open: boolean
  onClose: () => void
}

export default function EggTransferForm({
  open,
  onClose,
}: EggTransferFormProps) {
  const [transDateStart, setTransDateStart] = useState("")
  const [transDateEnd, setTransDateEnd] = useState("")
  const [duration, setDuration] = useState("")

  // Auto-compute duration whenever start or end dates change
  useEffect(() => {
    if (transDateStart && transDateEnd) {
      const start = new Date(transDateStart)
      const end = new Date(transDateEnd)
      
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
  }, [transDateStart, transDateEnd])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>🥚 Egg Transfer Process</DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="space-y-6 pt-4">
            {/* Reference Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="egg_ref">Egg Reference</Label>
                <Input id="egg_ref" placeholder="EGG-REF-001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farm_source">Farm Source</Label>
                <Input id="farm_source" placeholder="Farm A / Supplier Name" />
              </div>
            </div>

            <Separator />

            {/* Transfer Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trans_date_start">Transfer Start</Label>
                <Input 
                  id="trans_date_start" 
                  type="datetime-local"
                  value={transDateStart}
                  onChange={(e) => setTransDateStart(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trans_date_end">Transfer End</Label>
                <Input 
                  id="trans_date_end" 
                  type="datetime-local"
                  value={transDateEnd}
                  onChange={(e) => setTransDateEnd(e.target.value)}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                placeholder="Auto-computed" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              {/* <p className="text-xs text-muted-foreground">
                Automatically calculated from start/end times
              </p> */}
            </div>

            <Separator />

            {/* Egg Counts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_egg">Total Eggs</Label>
                <Input id="total_egg" type="number" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_bangers">Number of Bangers</Label>
                <Input id="num_bangers" type="number" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="good_eggs">Good Eggs</Label>
                <Input
                  id="good_eggs"
                  type="number" 
                  disabled
                />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button>Save</Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button> 
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}