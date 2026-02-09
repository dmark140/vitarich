"use client"

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
                <Input id="trans_date_start" type="datetime-local" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trans_date_end">Transfer End</Label>
                <Input id="trans_date_end" type="datetime-local" />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="Auto / Manual" />
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
                  placeholder="Auto computed"
                  disabled
                />
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="flex items-center justify-between max-w-sm">
              <div className="space-y-1">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Mark if this transfer is active
                </p>
              </div>
              <Switch />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
