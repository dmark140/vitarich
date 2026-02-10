"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Chickgrading() {
  // Classification counts
  const [classA, setClassA] = useState(0)
  const [classB, setClassB] = useState(0)
  const [classAJunior, setClassAJunior] = useState(0)
  const [cullChicks, setCullChicks] = useState(0)
  const [deadChicks, setDeadChicks] = useState(0)
  const [infertile, setInfertile] = useState(0)
  const [deadGerm, setDeadGerm] = useState(0)
  const [livePip, setLivePip] = useState(0)
  const [deadPip, setDeadPip] = useState(0)
  const [unhatched, setUnhatched] = useState(0)
  const [rotten, setRotten] = useState(0)

  // Computed values
  const [totalChicks, setTotalChicks] = useState(0)
  const [goodQualityChicks, setGoodQualityChicks] = useState(0)
  const [qualityGradeRate, setQualityGradeRate] = useState(0)
  const [cullRate, setCullRate] = useState(0)

  // Auto-compute summary statistics
  useEffect(() => {
    // Total Chicks = Class A + Class B + Class A Junior + Cull Chicks
    const total = classA + classB + classAJunior + cullChicks

    // Good Quality Chicks = Class A + Class B + Class A Junior
    const goodQuality = classA + classB + classAJunior

    // Quality Grade Rate (%) = (Good Quality Chicks / Total Chicks) * 100
    const gradeRate = total > 0 ? (goodQuality / total) * 100 : 0

    // Cull Rate (%) = (Cull Chicks / Total Chicks) * 100
    const cull = total > 0 ? (cullChicks / total) * 100 : 0

    setTotalChicks(total)
    setGoodQualityChicks(goodQuality)
    setQualityGradeRate(Math.round(gradeRate * 100) / 100) // Round to 2 decimals
    setCullRate(Math.round(cull * 100) / 100) // Round to 2 decimals
  }, [classA, classB, classAJunior, cullChicks])

  const handleNumberChange = (
    value: string,
    setter: (val: number) => void
  ) => {
    const num = parseInt(value) || 0
    setter(num >= 0 ? num : 0)
  }

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
          <div>
            <Label>Class A</Label>
            <Input
              type="number"
              min={0}
              value={classA}
              onChange={(e) => handleNumberChange(e.target.value, setClassA)}
            />
          </div>

          <div>
            <Label>Class B</Label>
            <Input
              type="number"
              min={0}
              value={classB}
              onChange={(e) => handleNumberChange(e.target.value, setClassB)}
            />
          </div>

          <div>
            <Label>Class A Junior</Label>
            <Input
              type="number"
              min={0}
              value={classAJunior}
              onChange={(e) => handleNumberChange(e.target.value, setClassAJunior)}
            />
          </div>

          <div>
            <Label>Cull Chicks</Label>
            <Input
              type="number"
              min={0}
              value={cullChicks}
              onChange={(e) => handleNumberChange(e.target.value, setCullChicks)}
            />
          </div>

          <div>
            <Label>Dead Chicks</Label>
            <Input
              type="number"
              min={0}
              value={deadChicks}
              onChange={(e) => handleNumberChange(e.target.value, setDeadChicks)}
            />
          </div>

          <div>
            <Label>Infertile</Label>
            <Input
              type="number"
              min={0}
              value={infertile}
              onChange={(e) => handleNumberChange(e.target.value, setInfertile)}
            />
          </div>

          <div>
            <Label>Dead Germ</Label>
            <Input
              type="number"
              min={0}
              value={deadGerm}
              onChange={(e) => handleNumberChange(e.target.value, setDeadGerm)}
            />
          </div>

          <div>
            <Label>Live Pip</Label>
            <Input
              type="number"
              min={0}
              value={livePip}
              onChange={(e) => handleNumberChange(e.target.value, setLivePip)}
            />
          </div>

          <div>
            <Label>Dead Pip</Label>
            <Input
              type="number"
              min={0}
              value={deadPip}
              onChange={(e) => handleNumberChange(e.target.value, setDeadPip)}
            />
          </div>

          <div>
            <Label>Unhatched</Label>
            <Input
              type="number"
              min={0}
              value={unhatched}
              onChange={(e) => handleNumberChange(e.target.value, setUnhatched)}
            />
          </div>

          <div>
            <Label>Rotten</Label>
            <Input
              type="number"
              min={0}
              value={rotten}
              onChange={(e) => handleNumberChange(e.target.value, setRotten)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">Total Chicks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-center">
            {totalChicks}
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">Good Quality Chicks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-center">
            {goodQualityChicks}
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">Quality Grade Rate (%)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-center">
            {qualityGradeRate}%
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">Cull Rate (%)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-center">
            {cullRate}%
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 sticky bottom-0 bg-background py-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>

    </div>
  )
}