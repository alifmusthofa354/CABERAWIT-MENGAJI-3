"use client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchUserClass } from "@/actions/ClassActions";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";

import DropDownMenu from "@/components/custom/generalClass/DropDownMenu";
import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import Image from "next/image";
import {
  FaCheckCircle,
  FaCircle,
  FaWhatsapp,
  FaBookOpen,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type ClassroomDetails = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  kode: string;
  link_wa: string;
  status: number; // 0: non-aktif, 1: aktif, 2: arsip/terhapus (sesuaikan jika ada nilai lain)
};

type UserClassroom = {
  id: string; // id dari user_classroom
  id_class: string; // foreign key ke classroom
  email: string;
  isOwner: boolean;
  status: number; // status relasi user dengan classroom (misal: 0: pending, 1: joined)
  classroom: ClassroomDetails; // 'classroom' tidak lagi bersifat opsional karena sudah difilter di backend
};

export default function Page() {
  const isActive = true; // Contoh status aktif, bisa diganti dengan data dinamis
  const idClass = 3;
  const queryClient = useQueryClient();
  const { selectedClassName, updateSelectedClassName } = useStore();

  const {
    data: userClasses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserClassroom[], Error>({
    queryKey: ["userClasses", selectedClassName],
    queryFn: () => fetchUserClass(selectedClassName as string),
    // enabled: !!selectedClassName,
  });
  const mainClass = userClasses[0];

  useEffect(() => {
    console.log("ini use effect");
    if (mainClass) {
      console.log(mainClass.id);
      if (mainClass.id === selectedClassName) {
        console.log("ini sama");
      } else {
        console.log("ini beda");
        queryClient.setQueryData(["userClasses", mainClass.id], userClasses);
        updateSelectedClassName(mainClass.id);
      }
    }
  }, [
    mainClass,
    updateSelectedClassName,
    selectedClassName,
    queryClient,
    userClasses,
  ]);

  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  if (isLoading)
    return (
      <>
        <Button disabled>
          <Loader2 className="animate-spin" />
          Memuat Data Kelas...
        </Button>
      </>
    );

  if (isError) {
    const noClassroom = error.message === "No classroom";
    return (
      <>
        <h2>{noClassroom ? "No classroom" : error.message}</h2>
        <Button onClick={handleRetry}>Retry</Button>
      </>
    );
  }

  // Tambahkan penanganan untuk kasus di mana userClasses kosong setelah loading selesai
  if (!mainClass) {
    return (
      <div className="min-h-svh bg-gray-50 @container flex flex-col">
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <SelectClass />
            </div>
          </div>
        </div>
        {/* Ini adalah div yang akan mengisi sisa ruang dan memusatkan kontennya */}
        <div className="flex-grow flex justify-center items-center p-4 ">
          <p className="text-gray-600 text-center">
            Tidak ada kelas yang ditemukan atau dipilih. Silakan pilih kelas
            dari dropdown di atas.
          </p>
          {/* Anda bisa menambahkan tombol untuk menambahkan kelas baru di sini jika perlu */}
          {/* <Button onClick={handleRetry}>Coba Lagi</Button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50 @container">
      <div className="bg-white shadow-md p-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="pr-3">
            <SelectClass />
          </div>
        </div>
      </div>
      <div className=" mx-auto p-4 md:p-6 mt-1 min-h-max">
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max">
          <div className="relative">
            <Image
              alt={`image kelas ${mainClass.classroom.name}`}
              src={
                mainClass.classroom.image_url ??
                "https://nybxzkiebrcyzvunjmig.supabase.co/storage/v1/object/public/cover-class-caberawit//coverclass-default.webp"
              }
              className="w-full h-32 md:h-48 object-cover"
              width={768} // Sesuaikan lebar
              height={200} // Sesuaikan tinggi
              priority // Tambahkan priority jika ini adalah gambar utama di above-the-fold
            />
            <div className="absolute top-2 left-2 md:top-4 md:left-4">
              {isActive ? (
                <div className="bg-green-500 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCheckCircle className="mr-1" />
                  Aktif
                </div>
              ) : (
                <div className="bg-gray-500 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCircle className="mr-1" />
                  Tidak Aktif
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2 md:top-4 md:right-4 text-white">
              <DropDownMenu idClass={idClass} isActive={isActive} />
            </div>
          </div>
          <div className="p-4">
            {/* Nama Kelas yang Lebih Menarik */}
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {mainClass.classroom.name}
              </h1>
            </div>

            {/* Deskripsi dengan Card Style */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
              <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                {mainClass.classroom.description}
              </p>
            </div>

            {/* Tombol WA Grup yang Lebih Menarik */}
            <div className="mt-4">
              <a
                href={mainClass.classroom.link_wa}
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Grup WhatsApp
              </a>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
