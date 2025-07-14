"use client";
import { useQuery } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fechingStudents } from "@/actions/PeopleClassAction";
import { fechingPeople } from "@/actions/PeopleClassAction";

import { FaCopy } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { toast as sonner } from "sonner";
import ButtonSendWa from "../absense/ButtonSendWa";

type StudentsType = {
  id: string;
  name: string;
  photo: string;
  status: number;
};

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

// Fungsi pembantu untuk menghasilkan daftar siswa dalam format teks
const generateStudentListString = (students: StudentsType[]) => {
  if (!students || students.length === 0) {
    return "Tidak ada siswa terdaftar.";
  }
  return students
    .map((student, index) => `${index + 1}. ${student.name}`)
    .join("\n");
};
const generateTeacherListString = (teachers: PeopleType[]) => {
  if (!teachers || teachers.length === 0) {
    return "Tidak ada guru terdaftar.";
  }
  return teachers
    .map((teachers, index) => `${index + 1}. ${teachers.users.name}`)
    .join("\n");
};

const STUDENT_LIST_PLACEHOLDER = "[STUDENT_LIST]";
const TEACHER_LIST_PLACEHOLDER = "[TEACHER_LIST]";

export default function PreviewTemplate({
  value,
  canSendWa = false,
}: {
  value: string;
  canSendWa?: boolean;
}) {
  const { selectedClassName } = useStore();

  const {
    data: Students = [],
    isError,
    error,
    refetch,
  } = useQuery<StudentsType[], Error>({
    queryKey: ["students", selectedClassName],
    queryFn: () => fechingStudents(selectedClassName as string),
    staleTime: Infinity,
  });

  const {
    data: people = [],
    isError: isErrorPeople,
    error: errorPeople,
    refetch: refetchPeople,
  } = useQuery<PeopleType[], Error>({
    queryKey: ["people", selectedClassName],
    queryFn: () => fechingPeople(selectedClassName as string),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isError) {
      console.log(error);
      if (error.message === "No classroom") return;
      sonner.error("Pesan Error", {
        description: (error as Error).message,
        action: {
          label: "Refresh",
          onClick: () => {
            refetch();
          },
        },
      });
    }
    if (isErrorPeople) {
      console.log(errorPeople);
      if (errorPeople.message === "No classroom") return;
      sonner.error("Pesan Error", {
        description: (errorPeople as Error).message,
        action: {
          label: "Refresh",
          onClick: () => {
            refetchPeople();
          },
        },
      });
    }
  }, [isError, error, refetch, isErrorPeople, errorPeople, refetchPeople]);

  const studentList = generateStudentListString(Students);
  const teacherList = generateTeacherListString(people);
  let preview = value.replace(STUDENT_LIST_PLACEHOLDER, studentList);
  preview = preview.replace(TEACHER_LIST_PLACEHOLDER, teacherList);

  const handleCopy = () => {
    if (preview) {
      navigator.clipboard.writeText(preview);
      toast.success("Message has been copied to clipboard.");
    } else {
      toast.error("Sorry, an empty message cannot be copied.");
    }
  };

  return (
    <>
      <div className="p-1.5 w-full  flex justify-end gap-2 -mt-2 md:-mt-4">
        <Button size={"custom_icon"} variant={"outline"} onClick={handleCopy}>
          <span className="sr-only">Copy</span>
          <FaCopy />
        </Button>
      </div>
      <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-gray-800 border border-gray-300 h-full">
        {preview || "No template saved yet."}
      </div>
      {canSendWa && (
        <>
          <div className="w-full mt-4 md:mt-6 flex flex-col gap-2 md:flex-row md:gap-4">
            <Button className="w-full md:flex-1" onClick={handleCopy}>
              <FaCopy />
              <span>Copy</span>
            </Button>
            <ButtonSendWa handleCopy={handleCopy} />
          </div>
        </>
      )}
    </>
  );
}
