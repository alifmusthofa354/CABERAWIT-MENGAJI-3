"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useMemo, useCallback } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function getData(): Promise<Attendance[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      status: "P",
      id_sudent: "1",
      name: "alif musthofa",
    },
    {
      id: "828ed52f",
      status: "UA",
      id_sudent: "2",
      name: "fauzan minmah",
    },
    {
      id: "928ed52f",
      status: "P",
      id_sudent: "3",
      name: "zelda mezata uzumaki",
    },
    {
      id: "a28ed52f",
      status: "AWOL",
      id_sudent: "4",
      name: "budi budarsono",
    },
  ];
}

export type Attendance = {
  id: string;
  status: "P" | "UA" | "AWOL";
  id_sudent: string;
  name: string;
};

export default function DataTableAbsense() {
  const [data, setData] = useState<Attendance[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  // Menggunakan useEffect untuk memanggil getData saat komponen dimuat
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getData();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  // Fungsi untuk menangani perubahan status
  const handleStatusChange = useCallback(
    (id: string, newStatus: Attendance["status"]) => {
      setData((prevData) =>
        prevData.map((row) =>
          row.id === id ? { ...row, status: newStatus } : row
        )
      );
    },
    []
  );

  // Kolom tabel - di-memoize dengan useMemo
  const columns: ColumnDef<Attendance>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
          <Select
            value={row.getValue("status")}
            onValueChange={(newValue: Attendance["status"]) =>
              handleStatusChange(row.original.id, newValue)
            }
          >
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
    ],
    [handleStatusChange] // Dependensi untuk useMemo
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  // --- Perbaikan pada fungsi handleChangeSelected ---
  const handleChangeSelected = useCallback(
    (value: Attendance["status"]) => {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedIds = new Set(selectedRows.map((row) => row.original.id)); // Gunakan Set untuk pencarian ID yang lebih efisien

      // Memperbarui state `data`
      setData((prevData) =>
        prevData.map((row) =>
          selectedIds.has(row.id) ? { ...row, status: value } : row
        )
      );

      // Opsional: Kosongkan pilihan setelah aksi
      table.toggleAllRowsSelected(false);
    },
    [table]
  ); // Dependency `table` diperlukan karena kita menggunakan `table.getFilteredSelectedRowModel()`

  return (
    <>
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex gap-2 my-2">
          <Select
            onValueChange={(value: Attendance["status"]) =>
              handleChangeSelected(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choose a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="P">P</SelectItem>
              <SelectItem value="UA">UA</SelectItem>
              <SelectItem value="AWOL">AWOL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <p className="text-sm">{JSON.stringify(data)}</p>
    </>
  );
}
