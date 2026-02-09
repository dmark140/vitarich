"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Chickgrading() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Chick Grading Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Batch Code</Label>
            <Input placeholder="Batch-2026-001" />
          </div>

          <div>
            <Label>Grading Date & Time</Label>
            <Input type="datetime-local" />
          </div>

          <div className="md:col-span-2">
            <Label>Grading Personnel</Label>
            <Input placeholder="Technician Name" />
          </div>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Chick Room Temperature (°C)</Label>
          <Input type="number" step="0.01" />
        </CardContent>
      </Card>

      {/* Classification */}
      <Card>
        <CardHeader>
          <CardTitle>Chick Classification</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "Class A",
            "Class B",
            "Class A Junior",
            "Cull Chicks",
            "Dead Chicks",
            "Infertile",
            "Dead Germ",
            "Live Pip",
            "Dead Pip",
            "Unhatched",
            "Rotten",
          ].map((label) => (
            <div key={label}>
              <Label>{label}</Label>
              <Input type="number" min={0} defaultValue={0} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          "Total Chicks",
          "Good Quality Chicks",
          "Quality Grade Rate (%)",
          "Cull Rate (%)",
        ].map((title) => (
          <Card key={title} className="bg-muted">
            <CardHeader>
              <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-center">
              0
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-background py-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>

    </div>
  )
}
