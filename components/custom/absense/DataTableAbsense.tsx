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
import { useQuery } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import useScheduleStore from "@/stores/useStoreSchedule";
import { fechingStudents } from "@/actions/PeopleClassAction";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SubmitAttedance from "./SubmitAttedance";
import LegendAbsensi from "./LegendAbsensi";

export type Attendance = {
  id: string;
  name: string;
  status: "Hadir" | "Ijin" | "Alfa";
};

type StudentsType = {
  id: string;
  name: string;
  status: number;
};

export default function DataTableAbsense({ ishidden = false }) {
  const { selectedClassName } = useStore();
  const { selectedScheduleName } = useScheduleStore();
  const router = useRouter();
  const {
    data: StudentsData = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<StudentsType[], Error>({
    queryKey: ["students", selectedClassName],
    queryFn: () => fechingStudents(selectedClassName as string),
    staleTime: Infinity,
  });

  const [recordData, setRecordData] = useState<Attendance[]>([]);
  const [rowSelection, setRowSelection] = useState({});
  // Efek samping untuk memproses data students saat studentsData berubah
  useEffect(() => {
    if (StudentsData.length > 0) {
      // Filter students yang memiliki status 1
      const activeStudents = StudentsData.filter(
        (student) => student.status === 1
      );
      // Peta (map) data students menjadi format Attendance
      const initialAttendance: Attendance[] = activeStudents.map((student) => ({
        id: student.id,
        name: student.name,
        status: "Hadir", // Set status default menjadi 'Hadir' untuk setiap siswa
      }));
      setRecordData(initialAttendance);
    }
  }, [StudentsData]);

  // Fungsi untuk menangani perubahan status
  const handleStatusChange = useCallback(
    (id: string, newStatus: Attendance["status"]) => {
      setRecordData((prevData) =>
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
    data: recordData,
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
      setRecordData((prevData) =>
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

  if (isLoading && selectedScheduleName) {
    return (
      <span className="text-center text-white mt-4 p-4 bg-gray-400 rounded-md border border-gray-500 flex items-center justify-center gap-2 ">
        <Loader2 className="animate-spin" />
        Sedang memuat data siswa
      </span>
    );
  }

  if (isError && selectedScheduleName) {
    return (
      <div className="text-center text-gray-600 mt-4 p-4 bg-red-100 rounded-md border border-red-200 min-w-full gap-3">
        <p>Maaf, terjadi kesalahan saat memuat data siswa</p>
        <Button variant="destructive" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
    );
  }

  if (
    !isLoading &&
    selectedScheduleName &&
    StudentsData &&
    StudentsData.length === 0
  ) {
    return (
      <div className="text-center text-blue-700 mt-4 p-4 bg-blue-50 rounded-md border border-blue-200 min-w-full gap-3">
        <p className="mb-3">
          Data siswa belum tersedia. Silakan tambahkan data siswa untuk
          melanjutkan.
        </p>
        <Button
          variant="default"
          onClick={() => router.push("/dashboard/kelas/people")}
        >
          Tambah Siswa Baru
        </Button>
      </div>
    );
  }

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

          <LegendAbsensi record={recordData} />

          <SubmitAttedance recordData={recordData} />
        </>
      )}
    </>
  );
}
