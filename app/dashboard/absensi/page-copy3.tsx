"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export type Attendance = {
  id: string;
  status: boolean;
  description: string;
};

function Page() {
  const [data, setData] = useState(() => [
    { id: "1", status: true, description: "Task A" },
    { id: "2", status: false, description: "Task B" },
    { id: "3", status: true, description: "Task C" },
    { id: "4", status: false, description: "Task D" },
  ]);

  const columns: ColumnDef<Attendance>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <>{row.getValue("id")}</>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <>{row.getValue("description")}</>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getValue("status")}
          onChange={(e) => {
            setData((prevData) => {
              return prevData.map((item) => {
                if (item.id === row.getValue("id")) {
                  return { ...item, status: e.target.checked };
                }
                return item;
              });
            });
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Tanstack Table dengan Kolom Status yang Bisa Diupdate</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}

export default Page;
