/* eslint-disable @typescript-eslint/no-explicit-any */

import { ColumnDef } from "@tanstack/react-table";
import { CodeNameBase, SeriesInterface } from "./DefaultTypes";

export const ColumnsYesOrNo: ColumnDef<CodeNameBase>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
];

export const ColumnsYesOrNoCodeOnly: ColumnDef<CodeNameBase>[] = [
    { accessorKey: "code", header: "Code" },
];

export const ColumnsCodeNameBase: ColumnDef<CodeNameBase>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
];
