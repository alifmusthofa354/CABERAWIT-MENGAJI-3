// ClassList.tsx

"use client";

import { FaUserCheck, FaEllipsisV, FaGithub, FaUsers } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "../_actions/ClassAction";
import Image from "next/image";

interface Class {
  id: number;
  name: string;
  email: string;
  membersCount: number;
}

const ClassCard = ({ kelas }: { kelas: Class }) => (
  <div
    key={kelas.id}
    className="rounded-lg shadow-md overflow-hidden bg-amber-50"
  >
    <div className="relative">
      <Image
        alt="Classroom image"
        src="/coverclassroom.jpg"
        className="w-full h-32 object-cover"
        width={500}
        height={500}
      />
      <div className="absolute top-2 left-2 bg-white text-green-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
        <FaUserCheck className="mr-1" />
        Members
      </div>
      <div className="absolute top-2 right-2 text-white">
        <FaEllipsisV />
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-orange-600 mb-2 max-w-full truncate">
        {kelas.name}
      </h3>

      <div className="flex  justify-between items-center text-sm text-gray-700">
        <span className="flex items-center max-w-2/3 truncate whitespace-nowrap flex-grow ">
          <FaGithub className="mr-1" />
          <p className="max-w-5/6 truncate">
            {kelas.membersCount} NADIA ALIFA SALISA RAYA BATANA SAMA SAJA
          </p>
        </span>
        <span className="flex items-center whitespace-nowrap min-w-min">
          <FaUsers className="mr-1" />
          <p className="">{kelas.membersCount} 1000 Murid</p>
        </span>
      </div>
    </div>
  </div>
);

export default function ClassList() {
  const {
    data: classes,
    isLoading,
    isError,
    error,
  } = useQuery<Class[], Error>({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  if (isLoading) return <div className="text-center">Loading...</div>;

  if (isError)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );

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
