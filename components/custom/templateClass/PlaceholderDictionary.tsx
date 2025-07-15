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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success(`'${text}' copied to clipboard!`);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
          toast.error("Failed to copy. Please try again.");
        });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        toast.success(`'${text}' copied to clipboard!`);
      } catch (err) {
        console.error("Failed to copy text (execCommand): ", err);
        toast.error("Failed to copy. Please try again.");
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className=" p-2 md:p-4 bg-gray-200 ">
      <div className="space-y-2 md:space-y-4 ">
        {placeholders.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-white p-5 rounded-xl border border-gray-200 shadow-md
                       transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg
                       hover:border-gray-500 cursor-pointer relative active:scale-[1.04] active:shadow-lg active:border-gray-800"
            onClick={() => copyToClipboard(item.placeholder)}
          >
            <Button
              disabled
              variant="ghost" // Gunakan variant ghost agar tidak ada background
              size="icon" // Gunakan size icon untuk tombol hanya ikon
              className="absolute top-0 right-0 "
            >
              <FaCopy className="text-lg" />
            </Button>
            <p
              className="text-gray-800 text-sm md:text-base text-center 
                             mb-2 border-b border-gray-400 pb-2"
            >
              {item.placeholder}
            </p>

            <p className="text-gray-700  text-sm md:text-base text-center font-extralight ">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
