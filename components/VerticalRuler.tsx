"use client";

import React, { useMemo, useEffect, useState } from "react";
import SearchableCombobox from "@/components/SearchableCombobox";

type Props = {
  label: string;
  min: number;
  max: number;
  value?: number | string;
  onChange: (value: number) => void;
  required?: boolean;
  className?: string;
  autoOpen?: boolean;
};

export function VerticalRuler({
  label,
  min,
  max,
  value,
  onChange,
  required = false,
  className = "w-full",
  autoOpen = false,
}: Props) {
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    return Array.from({ length: max - min + 1 }, (_, i) => {
      const num = min + i;
      return {
        code: String(num),
        name: String(num),
      };
    });
  }, [min, max]);

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  return (
    <SearchableCombobox
      required={required}
      label={label}
      showCode
      items={items}
      value={value?.toString() ?? ""}
      onValueChange={(val: string) => onChange(Number(val))}
      className={className}
      open={open}
      onOpenChange={setOpen}
    />
  );
}