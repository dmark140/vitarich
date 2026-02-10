"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DeliveryReceiptLayout() {
  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Delivery Receipt</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* ===== HEADER SECTION ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-3">
            <Field label="Date">
              <Input value="01/01/2026" readOnly />
            </Field>

            <Field label="Farm Name">
              <Input value="BROILER FARM 1" />
            </Field>

            <Field label="Hauler Plate Number">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select plate number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plate1">ABC-123</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Chick Van Temp">
              <Input placeholder="°C" />
            </Field>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <Field label="Delivery Receipt No.">
              <Input value="DR-11XXX11" readOnly />
            </Field>

            <Field label="Hauler Name">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select hauler" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hauler1">HAULER A</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Truck Seal Number">
              <Input />
            </Field>

            <Field label="Number of Fans">
              <Input />
            </Field>
          </div>
        </div>

        {/* ===== BATCH / SKU SECTION ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div className="space-y-3">
            <Field label="DOC Batch Code">
              <Input value="001FARM1B1P1-010126-B1%Sequence%" />
            </Field>

            <Field label="SKU Classification">
              <Input value="Saleable / By Product" />
            </Field>
          </div>

          <div className="space-y-3">
            <Field label="Qty">
              <Input />
            </Field>

            <Field label="SKU Name">
              <Input value="Class C" />
            </Field>

            <Button className="w-fit self-end mt-6">Add Item</Button>
          </div>
        </div>

        {/* ===== ITEMS TABLE ===== */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Doc Batch Code</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>UoM</TableHead>
                <TableHead className="text-right">Qty</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </TableCell>
                <TableCell>001FARM1B1P1-010126-B1%</TableCell>
                <TableCell>Class A</TableCell>
                <TableCell>SALEABLE</TableCell>
                <TableCell>TRAY</TableCell>
                <TableCell className="text-right">100</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </TableCell>
                <TableCell>001FARM1B1P1-010126-B1%</TableCell>
                <TableCell>Class C</TableCell>
                <TableCell>SALEABLE</TableCell>
                <TableCell>PCS</TableCell>
                <TableCell className="text-right">100</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* ===== REMARKS ===== */}
        <div>
          <Label>Remarks</Label>
          <Textarea placeholder="Sample remarks" />
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex justify-between pt-6">
          <Button className="w-40">Save</Button>
          <Button variant="secondary" className="w-40">
            Cancel
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

/* ===== Small Helper Component ===== */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
