"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";

import { useEffect } from "react";
import { fechingPeople } from "@/actions/PeopleClassAction";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaUsers } from "react-icons/fa";

import DropDownMenuStudent from "@/components/custom/peopleClass/Students/DropDownMenuStudent";
import AddStudent from "@/components/custom/peopleClass/Students/AddButtonStudent";
import TeacherList from "@/components/custom/peopleClass/TeacherList";
import OwnerList from "@/components/custom/peopleClass/OwnerList";

type PeopleType = {
  id: string;
  isOwner: boolean;
  status: number;
  email: string;
  users: {
    name: string;
    photo: string;
  };
};

const Students = [
  {
    name: "Dea Putri Handayani",
    image: "https://xsgames.co/randomusers/avatar.php?g=female",
    status: "active",
  },
  {
    name: "3403_Muhammad Fikri Ramadhan Dengan Nama Yang Sangat Sangat Panjang Sekali", // Contoh nama sangat panjang
    image:
      "https://storage.googleapis.com/a1aa/image/6Qe0vx2TIe-YtC3TlAU_mq0Ifp4d4UCpR3HN1YIEJYA.jpg",
    status: "active",
  },
  {
    name: "Almizt",
    image:
      "https://storage.googleapis.com/a1aa/image/a4hhBauqNORGAuMSbUsjENaYHm1qssEFeMsE7IRdhrs.jpg",
    status: "not active",
  },
  {
    name: "Divka",
    image:
      "https://storage.googleapis.com/a1aa/image/eDj5x9R8eBEm9gwWwz-YXE6H3Y1kuEjUzTesMy-nz4M.jpg",
    status: "active",
  },
];

export default function PeopleList() {
  const queryClient = useQueryClient();
  const { selectedClassName, updateSelectedClassName } = useStore();

  const { data: session } = useSession();

  const {
    data: people = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PeopleType[], Error>({
    queryKey: ["people", selectedClassName],
    queryFn: () => fechingPeople(selectedClassName as string),
    staleTime: Infinity,
  });

  console.log("people : ", people);

  const owner: PeopleType[] = people.filter(
    (person) => person.isOwner === true
  );
  const teacher: PeopleType[] = people.filter(
    (person) => person.isOwner === false
  );
  const isCanEdit = owner[0]?.id === selectedClassName;

  const email = session?.user?.email || "No emails";
  const userID = people.find((person) => person.email === email)?.id;

  useEffect(() => {
    if (userID) {
      if (userID !== selectedClassName) {
        queryClient.setQueryData(["people", userID], people);
        updateSelectedClassName(userID);
      }
    }
  }, [userID, selectedClassName, people, queryClient, updateSelectedClassName]);

  useEffect(() => {
    if (isError) {
      console.log(error);
      if (error.message === "No classroom") return;
      toast.error("Pesan Error", {
        description: (error as Error).message,
      });
    }
  }, [isError, error, refetch]); // Pastikan efek hanya berjalan saat isError atau error berubah

  return (
    <>
      <div className="mx-auto p-4 md:p-6 pb-18 md:pb-18 mt-1 min-h-max ">
        {/* Owner Section */}
        <OwnerList
          owner={owner}
          isLoading={isLoading}
          isError={isError}
          refetch={refetch}
        />
        {/* Teacher Section */}
        <TeacherList
          teacher={teacher}
          isCanEdit={isCanEdit}
          isLoading={isLoading}
          isError={isError}
        />

        {/* Student Active Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaUsers className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Students
              </h1>
            </div>
            <div>
              {Students.map((student, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* Flex container untuk nama dan status dengan flex-wrap */}
                      <div className="flex flex-wrap items-center ml-4">
                        <span className="mr-2 mb-1 sm:mb-0">
                          {student.name}
                        </span>
                        {/* Nama */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>
                    </div>
                    {isCanEdit && (
                      <DropDownMenuStudent idClass={index} isActive={true} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Add student Section */}
        <div className="fixed bottom-4 right-4">
          <AddStudent idClass={3} />
        </div>
      </div>
      <Toaster />
    </>
  );
}
