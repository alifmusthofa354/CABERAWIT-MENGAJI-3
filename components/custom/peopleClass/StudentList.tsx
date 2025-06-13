"use client";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fechingStudents } from "@/actions/PeopleClassAction";

import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaUsers } from "react-icons/fa";
import PeopleSkeleton from "./PeopleSkeleton";
import DropDownMenuStudent from "@/components/custom/peopleClass/Students/DropDownMenuStudent";

type StudentsType = {
  id: string;
  name: string;
  photo: string;
  status: number;
};

export default function StudentList({ isCanEdit }: { isCanEdit: boolean }) {
  const { selectedClassName } = useStore();

  const {
    data: Students = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StudentsType[], Error>({
    queryKey: ["students", selectedClassName],
    queryFn: () => fechingStudents(selectedClassName as string),
    staleTime: Infinity,
  });
  useEffect(() => {
    if (isError) {
      console.log(error);
      if (error.message === "No classroom") return;
      toast.error("Pesan Error", {
        description: (error as Error).message,
      });
    }
  }, [isError, error, refetch]);

  return (
    <>
      <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <FaUsers className="text-blue-600 text-2xl md:text-3xl mr-2" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Students
            </h1>
          </div>
          <div>
            {isLoading ? (
              <>
                {" "}
                <PeopleSkeleton />
                <PeopleSkeleton />
              </>
            ) : (
              <>
                {" "}
                {Students.map((student, index) => (
                  <div key={index}>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarImage src={student.photo} alt={student.name} />
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
                              student.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student.status === 1 ? "Active" : "Not Active"}
                          </span>
                        </div>
                      </div>
                      {isCanEdit && (
                        <DropDownMenuStudent
                          name={student.name}
                          idStudent={student.id}
                          isActive={student.status === 1}
                          photo={student.photo}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
