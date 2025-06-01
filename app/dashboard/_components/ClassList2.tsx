// ClassList.tsx

"use client";

import {
  FaUserCheck,
  FaUserFriends,
  FaCheckCircle,
  FaCircle,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "@/actions/ClassActions";
import Image from "next/image";
import ClassCardSkeleton from "./ClassCardSkeleton";
import { FiAlertCircle, FiBookOpen } from "react-icons/fi";
import { Button } from "@/components/ui/button";

import AddClass from "@/components/custom/AddClass";
import Link from "next/link";

interface Class {
  id: string;
  id_class: string;
  email: string;
  isOwner: boolean;
  status: number;
  classroom: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    kode: string;
    link_wa: string;
    status: number;
  };
}

const ClassCard = ({ kelas }: { kelas: Class }) => (
  <Link
    href={`/dashboard/kelas/`}
    className="rounded-lg shadow-md overflow-hidden bg-amber-50"
    key={kelas.id}
  >
    <div className="relative ">
      <Image
        alt={`cover image ${kelas.classroom.name}`}
        src={
          kelas.classroom.image_url ??
          "https://nybxzkiebrcyzvunjmig.supabase.co/storage/v1/object/public/cover-class-caberawit//coverclass-default.webp"
        }
        className="w-full h-32 md:min-h-48 object-cover"
        width={500}
        height={500}
      />
      <div className="absolute top-2 left-2 bg-white text-green-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
        {kelas.isOwner ? (
          <FaUserCheck className="mr-1" /> // Ikon untuk Owner, misalnya centang
        ) : (
          <FaUserFriends className="mr-1" /> // Ikon untuk Member, misalnya grup pengguna
        )}
        {kelas.isOwner ? "Owner" : "Member"}
      </div>
      <div className="absolute top-2 right-2 text-white">
        {kelas.classroom.status == 1 ? (
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
    </div>
    <div className="p-4">
      <h3 className="text-lg md:text-2xl font-semibold text-orange-600 mb-2 max-w-full truncate">
        {kelas.classroom.name}
      </h3>
      <p className="text-xs md:text-sm text-gray-700 truncate whitespace-nowrap">
        {kelas.classroom.description}
      </p>
    </div>
  </Link>
);

export default function ClassList() {
  const {
    data: classes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Class[], Error>({
    queryKey: ["classroom"],
    queryFn: fetchClasses,
    staleTime: Infinity,
  });
  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  if (isLoading)
    return (
      <>
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            <ClassCardSkeleton />
            <ClassCardSkeleton />
            <ClassCardSkeleton />
          </div>
        </div>
      </>
    );

  if (isError) {
    const noClassroom = error.message === "No classroom";

    return (
      <div className="p-6 flex justify-center items-center min-h-full">
        <div className="text-center">
          {noClassroom ? (
            <div>
              <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-700 mb-4">
                Tidak ada kelas.
              </p>
              <AddClass />
            </div>
          ) : (
            <div>
              <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-semibold text-red-700 mb-4">
                Terjadi kesalahan: {error.message}
              </p>

              <Button
                variant={"outline"}
                className=" transition-all duration-300 transform hover:scale-105 active:scale-95"
                onClick={handleRetry} // Tambahkan onClick di sini
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
        {classes && classes.length > 0 ? (
          classes.map((kelas) => <ClassCard key={kelas.id} kelas={kelas} />)
        ) : (
          <p>Tidak ada kelas.</p>
        )}
      </div>
    </div>
  );
}
