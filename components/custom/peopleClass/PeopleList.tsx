"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fechingPeople } from "@/actions/PeopleClassAction";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "sonner";

import AddStudent from "@/components/custom/peopleClass/Students/AddButtonStudent";
import TeacherList from "@/components/custom/peopleClass/TeacherList";
import OwnerList from "@/components/custom/peopleClass/OwnerList";
import AddClass from "../AddClass";
import StudentList from "./StudentList";

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

  if (people.length === 0 && !isLoading) {
    return (
      <>
        <div className="flex justify-center items-center flex-col flex-1">
          <p className="text-gray-600 text-center">
            Tidak ada kelas yang ditemukan. Silakan Buat kelas terlebih dahulu.
          </p>
          <AddClass mobile={true} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-4 md:p-6 pb-18 md:pb-18 mt-2 min-h-max">
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
        <StudentList isCanEdit={isCanEdit} />

        {/* Add student Section */}
        <div className="fixed bottom-4 right-4">
          <AddStudent />
        </div>
      </div>
      <Toaster />
    </>
  );
}
