"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // Asumsi Anda memiliki komponen Button dari shadcn/ui
import { FaCopy } from "react-icons/fa"; // Ikon untuk copy dan info
import toast from "react-hot-toast"; // Untuk notifikasi toast

// Data placeholder yang akan ditampilkan
const placeholders = [
  {
    placeholder: "[ABSENSI_LIST]",
    description: "Complete attendance list (all statuses)", // Terjemahan dari "Daftar absensi lengkap (semua status)"
  },
  {
    placeholder: "[ABSENSI_LIST_HADIR]",
    description: "List of students with 'Present' status", // Terjemahan dari "Daftar siswa dengan status Hadir"
  },
  {
    placeholder: "[ABSENSI_LIST_IJIN]",
    description: "List of students with 'Permitted' status", // Terjemahan dari "Daftar siswa dengan status Izin"
  },
  {
    placeholder: "[ABSENSI_LIST_ALFA]",
    description: "List of students with 'Absent' status", // Terjemahan dari "Daftar siswa dengan status Alfa"
  },
  {
    placeholder: "[ABSENSI_LIST_BELUM_HADIR]",
    description: "List of students with 'Not Yet Present' status", // Terjemahan dari "Daftar siswa dengan status Belum Hadir"
  },
  { placeholder: "[STUDENT_LIST]", description: "List of all students" }, // Terjemahan dari "Daftar semua siswa"
  { placeholder: "[TEACHER_LIST]", description: "List of all teachers" }, // Terjemahan dari "Daftar semua guru"
];

export default function PlaceholderDictionary() {
  // Fungsi untuk menyalin teks ke clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${text} has been copied to clipboard.`);
  };

  return (
    <div className=" p-2 md:p-4 bg-gray-300">
      <div className="space-y-2 md:space-y-4 ">
        {placeholders.map((item, index) => (
          <div
            key={index}
            className=" bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm transition-all duration-200 hover:bg-gray-100"
          >
            <p className="text-gray-700 font-medium text-sm md:text-base">
              {item.description}
            </p>
            <p className=" text-blue-700 text-sm  rounded-md ">
              {item.placeholder}
            </p>

            <Button
              variant="outline"
              size="sm"
              className="px-4 py-2 text-blue-600 border-blue-300 hover:bg-blue-100 transition-colors duration-200 rounded-md shadow-sm"
              onClick={() => copyToClipboard(item.placeholder)}
            >
              <FaCopy className="mr-2 text-xs" /> Salin
            </Button>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-800 mt-2 text-center bg-yellow-50 border border-yellow-300 rounded-md p-2">
        Please ensure you use the correct placeholder format (including square
        brackets[]).
      </p>
    </div>
  );
}
