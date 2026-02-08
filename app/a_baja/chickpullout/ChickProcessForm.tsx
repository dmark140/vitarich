"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function ChickProcessForm({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chick Process</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Enter chick processing details
          </p>
        </DialogHeader>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Egg Ref No */}
          <div className="space-y-1">
            <Label>Egg Reference No</Label>
            <Input placeholder="EGG-REF-001" />
          </div>

          {/* Chick Ref No */}
          <div className="space-y-1">
            <Label>Chick Reference No</Label>
            <Input placeholder="CHICK-REF-001" />
          </div>

          {/* Farm Source */}
          <div className="col-span-2 space-y-1">
            <Label>Farm Source</Label>
            <Input placeholder="Farm name / location" />
          </div>

          {/* Date Received */}
          <div className="space-y-1">
            <Label>Date Received</Label>
            <Input type="date" />
          </div>

          {/* Hatch Window */}
          <div className="space-y-1">
            <Label>Hatch Window (hrs)</Label>
            <Input type="number" placeholder="0" />
          </div>

          {/* Chicks Hatched */}
          <div className="space-y-1">
            <Label>Chicks Hatched</Label>
            <Input type="number" placeholder="0" />
          </div>

          {/* Dead in Shell */}
          <div className="space-y-1">
            <Label>Dead in Shell</Label>
            <Input type="number" placeholder="0" />
          </div>

          {/* Hatch Fertile */}
          <div className="space-y-1">
            <Label>Hatch Fertile</Label>
            <Input type="number" placeholder="0" />
          </div>

          {/* Mortality Rate */}
          <div className="space-y-1">
            <Label>Mortality Rate (%)</Label>
            <Input type="number" placeholder="0" />
          </div>

          {/* Remarks */}
          <div className="col-span-2 space-y-1">
            <Label>Remarks</Label>
            <Textarea placeholder="Optional notes..." />
          </div>

          {/* Active Switch */}
          <div className="col-span-2 flex items-center justify-between rounded-md border p-3">
            <Label className="text-sm">Active</Label>
            <Switch defaultChecked />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
