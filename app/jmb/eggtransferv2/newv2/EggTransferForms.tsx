/**
 * EggTransferForm Component
 *
 * A form component for creating and editing egg transfer records in the hatchery management system.
 * Supports both creation of new entries and editing of existing records via URL parameters.
 *
 * @component
 * @returns {JSX.Element} The rendered egg transfer form with fields for reference number,
 *                        farm source, transfer dates/times, duration, bangers count,
 *                        and total egg transfer quantity.
 *
 * @example
 * // Creating a new egg transfer entry
 * <EggTransferForm />
 *
 * @example
 * // Editing an existing egg transfer entry (via URL parameter ?id=123)
 * <EggTransferForm />
 *
 * @remarks
 * - This is a client component (uses "use client" directive)
 * - Requires URL search parameter 'id' to determine edit vs create mode
 * - Auto-populates farm_source field based on selected ref_no
 * - Calculates duration automatically when both start and end times are provided
 * - Performs validation on required fields and date range before submission
 * - Redirects to egg transfer list view upon successful save
 *
 * @state {FormState} form - Current form field values including reference number, dates, and quantities
 * @state {boolean} loading - Indicates if record data is being loaded for edit mode
 * @state {boolean} saving - Indicates if form submission is in progress
 * @state {Array} refOptions - List of available classification reference numbers for dropdown
 * @state {boolean} refLoading - Indicates if reference options are being loaded
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Breadcrumb from "@/lib/Breadcrumb";

import {
  createEggTransfer,
  updateEggTransfer,
  getEggTransferById,
  listClassiRefNos,
  getFarmSourceBySetterRef,
} from "./api";
import FormActionButtons from "@/components/FormActionButtons";
import { refreshSessionx } from "@/app/admin/user/RefreshSession";
import RequiredLabel from "@/components/RequiredLabel";
import SearchableDropdown from "@/lib/SearchableDropdown";

type FormState = {
  ref_no: string;
  farm_source: string;
  trans_date_start: string; // datetime-local
  trans_date_end: string; // datetime-local
  num_bangers: string;
  total_egg_transfer: string;
};

function minutesBetween(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  if (b < a) return null;
  return Math.floor((b - a) / 60000);
}

function fmtDuration(mins: number | null) {
  if (mins == null) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m} min`;
  return `${h} hr ${m} min`;
}

// Convert ISO -> datetime-local (best-effort)
function isoToLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function EggTransferForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const idParam = sp.get("id");
  const editId = idParam ? Number(idParam) : null;
  const isEdit = Number.isFinite(editId) && !!editId;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState<boolean>(!!isEdit);

  const [refOptions, setRefOptions] = useState<{ ref_no: string }[]>([]);
  const [refLoading, setRefLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    ref_no: "",
    farm_source: "",
    trans_date_start: "",
    trans_date_end: "",
    num_bangers: "",
    total_egg_transfer: "",
  });

  useEffect(() => {
    refreshSessionx(router);
  }, []);
  // load dropdown options (hatch_classification.classi_ref_no)
  useEffect(() => {
    let alive = true;
    (async () => {
      setRefLoading(true);
      try {
        const refs = await listClassiRefNos();
        if (!alive) return;

        setRefOptions(
          (refs ?? []).map((r) => ({
            ref_no: r,
          })),
        );
      } catch (e: any) {
        console.error(e);
      } finally {
        if (alive) setRefLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // load record when editing
  useEffect(() => {
    if (!isEdit || !editId) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const row = await getEggTransferById(editId);
        if (!alive) return;
        setForm({
          ref_no: row.ref_no ?? "",
          farm_source: row.farm_source ?? "",
          trans_date_start: isoToLocalInput(row.trans_date_start),
          trans_date_end: isoToLocalInput(row.trans_date_end),
          num_bangers: row.num_bangers?.toString() ?? "",
          total_egg_transfer: row.total_egg_transfer?.toString() ?? "",
        });
      } catch (e: any) {
        alert(e?.message ?? "Failed to load record.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isEdit, editId]);

  const durationMinutes = useMemo(() => {
    if (!form.trans_date_start) return null;
    if (!form.trans_date_end) return null;
    return minutesBetween(form.trans_date_start, form.trans_date_end);
  }, [form.trans_date_start, form.trans_date_end]);

  const isValidDates = useMemo(() => {
    if (!form.trans_date_start) return true;
    if (!form.trans_date_end) return true;
    return durationMinutes !== null;
  }, [form.trans_date_start, form.trans_date_end, durationMinutes]);

  async function handleSelectRef(val: string) {
    setForm((p) => ({
      ...p,
      ref_no: val,
      farm_source: "",
    }));

    if (!val) return;

    try {
      const farmSource = await getFarmSourceBySetterRef(val);
      setForm((p) => ({
        ...p,
        ref_no: val,
        farm_source: farmSource || "",
      }));
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "Failed to load farm source.");
    }
  }
  async function onSave() {
    if (!form.ref_no) {
      alert("Reference Number is required.");
      return;
    }
    if (!form.trans_date_start) {
      alert("Transfer Date & Time Start is required.");
      return;
    }
    if (!form.trans_date_end) {
      alert("Transfer Date & Time End is required.");
      return;
    }
    if (!isValidDates) {
      alert("Transfer End must be after Transfer Start.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ref_no: form.ref_no.trim() || null,
        farm_source: form.farm_source.trim() || null,

        trans_date_start: form.trans_date_start
          ? new Date(form.trans_date_start).toISOString()
          : null,
        trans_date_end: form.trans_date_end
          ? new Date(form.trans_date_end).toISOString()
          : null,

        duration: durationMinutes,

        num_bangers: form.num_bangers ? Number(form.num_bangers) : null,
        total_egg_transfer: form.total_egg_transfer
          ? Number(form.total_egg_transfer)
          : null,
      };

      if (isEdit && editId) {
        await updateEggTransfer(editId, payload);
      } else {
        await createEggTransfer(payload);
      }

      router.push("/jmb/eggtransferv2");
      router.refresh();
    } catch (e: any) {
      alert(e?.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full  px-6 py-6  mt-4 space-y-4">
      <Breadcrumb
        SecondPreviewPageName="Hatchery"
        FirstPreviewsPageName="Egg Transfer"
        CurrentPageName={isEdit ? "Edit Entry" : "New Entry"}
      />

      <Card className="w-full  min-h-[calc(90vh-120px)] p-6 space-y-4 mt-2">
        <CardContent className="max-w-2xl p-4 space-y-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* ONE COLUMN UI */}
              <div className="space-y-2">
                <RequiredLabel>Egg Reference Number</RequiredLabel>
                <SearchableDropdown
                  list={refOptions}
                  codeLabel="ref_no"
                  nameLabel="ref_no"
                  showNameOnly
                  value={form.ref_no}
                  onChange={(val) => handleSelectRef(val)}
                  disabled={saving || refLoading}
                />
                {/* <Select
                  value={form.ref_no}
                  onValueChange={(v) => setForm((p) => ({ ...p, ref_no: v }))}
                  disabled={refLoading || saving}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        refLoading ? "Loading..." : "Select Egg Reference No."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {refOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </div>

              {/* separator after Ref No. */}

              <div className="space-y-2">
                <Label>Farm Source</Label>
                <Input
                  value={form.farm_source}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, farm_source: e.target.value }))
                  }
                  readOnly
                  disabled
                />
              </div>
              <Separator />

              <div className="space-y-2">
                <RequiredLabel>Transfer Date &amp; Time Start</RequiredLabel>
                <Input
                  type="datetime-local"
                  value={form.trans_date_start}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trans_date_start: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Transfer Date &amp; Time End</Label>
                <Input
                  type="datetime-local"
                  value={form.trans_date_end}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, trans_date_end: e.target.value }))
                  }
                />
                {form.trans_date_start &&
                form.trans_date_end &&
                !isValidDates ? (
                  <p className="text-xs text-destructive mt-1">
                    End must be after Start.
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  disabled
                  value={fmtDuration(durationMinutes)}
                  placeholder=""
                />
              </div>

              <div className="space-y-2">
                <Label>No. of Bangers</Label>
                <Input
                  type="number"
                  value={form.num_bangers}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, num_bangers: e.target.value }))
                  }
                  placeholder=""
                />
              </div>

              <div className="space-y-2">
                <Label>Total Egg Transfer</Label>
                <Input
                  type="number"
                  value={form.total_egg_transfer}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      total_egg_transfer: e.target.value,
                    }))
                  }
                  placeholder=""
                />
              </div>

              {/* Actions */}
              <FormActionButtons
                saving={saving}
                isEdit={isEdit}
                // disabled={disabledAll}
                cancelPath="/jmb/eggtransferv2"
                onSave={onSave}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
