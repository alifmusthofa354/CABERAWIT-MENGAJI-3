"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Attendance = {
  id: string;
  status: "P" | "UA" | "AWOL";
  id_sudent: string;
  name: string;
};

export const columns: ColumnDef<Attendance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Select defaultValue={row.getValue("status")}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Choose a status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="P">P</SelectItem>
          <SelectItem value="UA">UA</SelectItem>
          <SelectItem value="AWOL">AWOL</SelectItem>
        </SelectContent>
      </Select>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "name",
  },
];
