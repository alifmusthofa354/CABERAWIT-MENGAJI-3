"use client";

import { FaUserCheck, FaUserFriends, FaFolder } from "react-icons/fa";
import useStore from "@/stores/useStoreClass";
import { useQuery } from "@tanstack/react-query";
import { ArchieveClasses } from "@/actions/ArchieveClassAction";
import Image from "next/image";
import { FiAlertCircle, FiBookOpen } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClassCardSkeleton from "./ClassCardSkeleton";

interface Class {
  id: string;
  isOwner: boolean;
  classroom: {
    name: string;
    description: string;
    image_url: string;
    status: number;
  };
}

const ClassCard = ({ kelas }: { kelas: Class }) => {
  const { updateSelectedClassName } = useStore();
  const handleClick = () => {
    updateSelectedClassName(kelas.id);
  };
  return (
    <Link
      href={`/dashboard/kelas/`}
      className="rounded-lg shadow-md overflow-hidden bg-white hover:bg-gray-100 cursor-pointer"
      key={kelas.id}
      onClick={handleClick}
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
          <div className="bg-gray-500 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full flex items-center">
            <FaFolder className="mr-1" /> {/* Changed icon to FaFolder */}
            Archieved
          </div>
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
};

export default function ArchieveClass() {
  const {
    data: classes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Class[], Error>({
    queryKey: ["archieveclassroom"],
    queryFn: ArchieveClasses,
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
    const noClassroom = error.message === "No Archieve Class";

    return (
      <div className="p-6 flex justify-center items-center min-h-full">
        <div className="text-center">
          {noClassroom ? (
            <div>
              <FiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-700 mb-4">
                Tidak ada Archieve Kelas.
              </p>
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
          <p>Tidak ada Archieve kelas.</p>
        )}
      </div>
    </div>
  );
}
