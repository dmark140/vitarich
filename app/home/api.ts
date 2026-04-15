import {
  endOfMonth,
  format,
  isBefore,
  min as minDate,
  parseISO,
  startOfMonth,
} from "date-fns";
import { db } from "@/lib/Supabase/supabaseClient";

type SetterDashboardRow = {
  setting_date: string | null;
  qty_set_egg: number | null;
};

type HatcheryDashboardRow = {
  daterec: string | null;
  total_egg: number | null;
};

export type DashboardDateFilter = {
  from: string;
  to: string;
};

type DashboardMetric = {
  filtered: number;
  today: number;
  month: number;
};

export type DashboardSummary = {
  eggsSet: DashboardMetric;
  chicksHatched: DashboardMetric;
  hatchabilityRate: DashboardMetric;
};

function sumByDateRange<T extends Record<string, number | string | null>>(
  rows: T[],
  dateKey: keyof T,
  valueKey: keyof T,
  from: string,
  to: string,
) {
  return rows.reduce((sum, row) => {
    const rowDate = String(row[dateKey] ?? "");
    if (!rowDate || rowDate < from || rowDate > to) return sum;
    return sum + Number(row[valueKey] ?? 0);
  }, 0);
}

function sumByExactDate<T extends Record<string, number | string | null>>(
  rows: T[],
  dateKey: keyof T,
  valueKey: keyof T,
  targetDate: string,
) {
  return rows.reduce((sum, row) => {
    return String(row[dateKey] ?? "") === targetDate
      ? sum + Number(row[valueKey] ?? 0)
      : sum;
  }, 0);
}

function toRate(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

export async function getDashboardSummary(
  filter: DashboardDateFilter,
): Promise<DashboardSummary> {
  const currentDate = filter.to;
  const currentDateObj = parseISO(currentDate);
  const monthStart = format(startOfMonth(currentDateObj), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(currentDateObj), "yyyy-MM-dd");
  const queryStart = format(
    minDate([parseISO(filter.from), parseISO(monthStart)]),
    "yyyy-MM-dd",
  );
  const queryEnd = isBefore(parseISO(filter.to), parseISO(monthEnd))
    ? monthEnd
    : filter.to;

  const [setterResponse, hatcheryResponse] = await Promise.all([
    db
      .from("setter_incubation_process")
      .select("setting_date, qty_set_egg")
      .gte("setting_date", queryStart)
      .lte("setting_date", queryEnd),
    db
      .from("egg_hatchery_process")
      .select("daterec, total_egg")
      .gte("daterec", queryStart)
      .lte("daterec", queryEnd),
  ]);

  if (setterResponse.error) throw setterResponse.error;
  if (hatcheryResponse.error) throw hatcheryResponse.error;

  const setterRows = (setterResponse.data ?? []) as SetterDashboardRow[];
  const hatcheryRows = (hatcheryResponse.data ?? []) as HatcheryDashboardRow[];

  const eggsSetFiltered = sumByDateRange(
    setterRows,
    "setting_date",
    "qty_set_egg",
    filter.from,
    filter.to,
  );
  const eggsSetToday = sumByExactDate(
    setterRows,
    "setting_date",
    "qty_set_egg",
    currentDate,
  );
  const eggsSetMonth = sumByDateRange(
    setterRows,
    "setting_date",
    "qty_set_egg",
    monthStart,
    monthEnd,
  );

  const chicksFiltered = sumByDateRange(
    hatcheryRows,
    "daterec",
    "total_egg",
    filter.from,
    filter.to,
  );
  const chicksToday = sumByExactDate(
    hatcheryRows,
    "daterec",
    "total_egg",
    currentDate,
  );
  const chicksMonth = sumByDateRange(
    hatcheryRows,
    "daterec",
    "total_egg",
    monthStart,
    monthEnd,
  );

  return {
    eggsSet: {
      filtered: eggsSetFiltered,
      today: eggsSetToday,
      month: eggsSetMonth,
    },
    chicksHatched: {
      filtered: chicksFiltered,
      today: chicksToday,
      month: chicksMonth,
    },
    hatchabilityRate: {
      filtered: toRate(chicksFiltered, eggsSetFiltered),
      today: toRate(chicksToday, eggsSetToday),
      month: toRate(chicksMonth, eggsSetMonth),
    },
  };
}
