"use client";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useScheduleStore from "@/stores/useStoreSchedule";
import DataTableAbsense from "@/components/custom/absense/DataTableAbsense";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Button } from "@/components/ui/button";
import {
  FaUserCheck,
  FaChevronLeft,
  FaChalkboardTeacher,
  FaCalendarAlt,
} from "react-icons/fa";
import SelectSchedule from "@/components/custom/absense/SelectSchedule";
import ClientDate from "@/components/custom/absense/ClientDate";

type kelastype = {
  id: string;
  classroom: {
    name: string;
  };
};

export default function Page() {
  const { selectedScheduleName } = useScheduleStore();
  const queryClient = useQueryClient();
  const { selectedClassName } = useStore();
  const [ClassSelected, setClassSelected] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (selectedClassName) {
      const kelas = queryClient.getQueryData<kelastype[]>(["classroom"]);
      let foundName: string | null = null;

      if (kelas && Array.isArray(kelas)) {
        // Find the class entry that matches idUserClassCurrent
        const foundClassEntry = kelas.find(
          (item) => item.id === selectedClassName
        );

        // If a matching entry is found and it has a classroom name, assign it
        if (foundClassEntry && foundClassEntry.classroom) {
          foundName = foundClassEntry.classroom.name;
        }
      }

      setClassSelected(foundName || "");
    } else {
      setClassSelected("belum ada kelas");
    }
  }, [selectedClassName, queryClient]);

  return (
    <>
      <div className="min-h-svh bg-gradient-to-br from-gray-50 to-gray-100 @container font-sans text-gray-800">
        {/* Header Dinamis dengan Bayangan Mengambang */}
        <header className="bg-white shadow-lg p-3 sticky top-0 z-50 transition-all duration-300 ease-in-out hover:shadow-xl">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <Button
                variant="outline" // Mengubah ke outline agar terlihat lebih elegan dan konsisten
                className="group flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 px-4 py-2 rounded-md"
                onClick={() => router.push("/dashboard/absensi")}
              >
                <FaChevronLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
                Kembali
              </Button>
            </div>
          </div>
        </header>

        {/* Konten Utama dengan Tata Letak Modern */}
        <main className="p-4 md:p-8 mt-4 flex-1 flex flex-col items-center">
          <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden min-h-max mb-6 transform transition-transform duration-300 hover:scale-[1.005]">
            <div className="p-5 md:p-6">
              {/* Bagian Judul yang Menarik */}
              <div className="flex items-center mb-6 border-b pb-4 border-gray-200">
                <FaUserCheck className="text-blue-700 text-3xl md:text-4xl mr-3 animate-bounce-in" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Buat Absensi
                  </span>
                </h1>
              </div>

              {/* Detail Kelas dan Guru dengan Ikon */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8 text-lg text-gray-700">
                <div className="flex items-center bg-blue-50 p-3 rounded-lg shadow-sm">
                  <FaChalkboardTeacher className="text-blue-500 text-xl mr-3" />
                  <p className="text-base md:text-xl md:font-semibold">
                    <span className="font-normal text-blue-800">
                      {ClassSelected}
                    </span>
                  </p>
                </div>
                <div className="flex items-center bg-purple-50 p-3 rounded-lg shadow-sm">
                  <FaUserCheck className="text-purple-500 text-xl mr-3" />
                  <p className="text-base md:text-xl md:font-semibold">
                    <span className="font-normal text-purple-800">
                      {session?.user?.name || "Guru Anonymous"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center bg-green-50 p-3 rounded-lg shadow-sm md:col-span-2">
                  <FaCalendarAlt className="text-green-500 text-xl mr-3" />
                  <ClientDate />
                  {/* ClientDate akan menampilkan tanggal di sini */}
                </div>
              </div>

              {/* Bagian Pilih Jadwal dan Tabel Absensi */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    Pilih Jadwal Mengajar Anda:
                  </h3>
                  <SelectSchedule />
                </div>

                <div className="bg-white pt-2 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    Daftar Absensi Siswa:
                  </h3>
                  <DataTableAbsense ishidden={selectedScheduleName === null} />
                  {selectedScheduleName === null && (
                    <p className="text-center text-gray-500 mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
                      Silakan pilih jadwal terlebih dahulu untuk menampilkan
                      daftar absensi.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
