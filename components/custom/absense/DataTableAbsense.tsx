"use client";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
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

const COLORS = ["#00C49F", "#958888", "#ff4242"];

async function getData(): Promise<Attendance[]> {
  // Simulate fetching data from your API here.
  // In a real application, you'd replace this with an actual API call (e.g., fetch('/api/attendance')).
  return [
    { id: "728ed52f", status: "Hadir", id_sudent: "1", name: "alif musthofa" },
    { id: "828ed52f", status: "Ijin", id_sudent: "2", name: "fauzan minmah" },
    { id: "828ed52a", status: "Ijin", id_sudent: "0", name: "Uzumaki Naruto" },
    { id: "a28ed52f", status: "Alfa", id_sudent: "4", name: "budi budarsono" },
    { id: "a28ed529", status: "Alfa", id_sudent: "5", name: "dewansyah" },
    { id: "a28ed528", status: "Alfa", id_sudent: "6", name: "danang" },
    { id: "a28ed521", status: "Alfa", id_sudent: "12", name: "schrono" },
    { id: "a28ed522", status: "Alfa", id_sudent: "3", name: "wahyu" },
    { id: "a28ed523", status: "Alfa", id_sudent: "11", name: "taha" },
    { id: "a28ed524", status: "Alfa", id_sudent: "12", name: "zalfa" },
    { id: "b1c2d3e4", status: "Hadir", id_sudent: "7", name: "siti hartinah" },
    { id: "f5g6h7i8", status: "Ijin", id_sudent: "8", name: "agus kurniawan" },
    { id: "j9k0l1m2", status: "Hadir", id_sudent: "9", name: "bunga lestari" },
    { id: "n3o4p5q6", status: "Hadir", id_sudent: "10", name: "candra dewi" },
  ];
}

export type Attendance = {
  id: string;
  status: "Hadir" | "Ijin" | "Alfa";
  id_sudent: string;
  name: string;
};

interface ChartDataEntry {
  name: string;
  value: number;
}

// Function to process raw attendance data into chart-friendly format
function processAttendanceData(
  attendanceRecords: Attendance[]
): ChartDataEntry[] {
  const statusCounts: { [key: string]: number } = {};

  attendanceRecords.forEach((record) => {
    statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
  });

  const orderedStatuses = ["Hadir", "Ijin", "Alfa"]; // Define preferred order
  const finalChartData: ChartDataEntry[] = orderedStatuses.map((status) => ({
    name: status,
    value: statusCounts[status] || 0, // Use 0 if status is not present
  }));

  return finalChartData;
}

export default function DataTableAbsense({ ishidden = false }) {
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
            <SelectTrigger className="w-[120px] md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hadir">
                <FaCheckCircle color="green" />
                Hadir
              </SelectItem>
              <SelectItem value="Ijin">
                <MdInfo color="gray" />
                Ijin
              </SelectItem>
              <SelectItem value="Alfa">
                <FaBan color="red" />
                Alfa
              </SelectItem>
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

  const isAnyRowSelected =
    table.getSelectedRowModel().rows.length > 0 ? true : false;

  const processedData = processAttendanceData(data);

  const getValue = (name: string) =>
    processedData.find((item) => item.name === name)?.value || 0;
  return (
    <>
      {!ishidden && (
        <>
          <div className="flex gap-2 my-2">
            <Select
              value={""}
              onValueChange={(value: Attendance["status"]) => {
                handleChangeSelected(value);
              }}
            >
              <SelectTrigger
                className="w-[180px]"
                disabled={!isAnyRowSelected}
                isArrow={isAnyRowSelected}
              >
                <SelectValue placeholder="Choose a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hadir">
                  <FaCheckCircle color="green" />
                  Hadir
                </SelectItem>
                <SelectItem value="Ijin">
                  <MdInfo color="gray" />
                  Ijin
                </SelectItem>
                <SelectItem value="Alfa">
                  <FaBan color="red" />
                  Alfa
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
            {table.getFilteredRowModel().rows.length} baris telah dipilih.
          </div>
          {/* Kontainer baru untuk legend dan total */}
          <div className="flex flex-col items-center justify-center mt-2">
            {" "}
            {/* Tambahkan flex-col, items-center, justify-center */}
            {/* Kontainer untuk Hadir, Ijin, Alfa agar bisa di tengah */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {" "}
              {/* Menggunakan flex-wrap untuk responsivitas */}
              <p
                className="flex items-center text-sm"
                style={{ color: COLORS[0] }}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2`}
                  style={{ backgroundColor: COLORS[0] }}
                ></span>
                Hadir: {getValue("Hadir")}
              </p>
              <p
                className="flex items-center text-sm"
                style={{ color: COLORS[1] }}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2`}
                  style={{ backgroundColor: COLORS[1] }}
                ></span>
                Ijin: {getValue("Ijin")}
              </p>
              <p
                className="flex items-center text-sm"
                style={{ color: COLORS[2] }}
              >
                <span
                  className={`w-3 h-3 rounded-full mr-2`}
                  style={{ backgroundColor: COLORS[2] }}
                ></span>
                Alfa: {getValue("Alfa")}
              </p>
            </div>
            {/* Total Jumlah */}
            <p className="text-center font-bold text-lg text-[#5e42ff]">
              Jumlah:{" "}
              {processedData.reduce((total, item) => total + item.value, 0)}
            </p>
          </div>
          {/* <p className="text-sm">{JSON.stringify(data)}</p> */}
        </>
      )}
    </>
  );
}
