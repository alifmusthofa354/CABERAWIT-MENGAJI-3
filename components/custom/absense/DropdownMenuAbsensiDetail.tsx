import { updateAbsensi } from "@/actions/AbsensiAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { FaEllipsisV, FaCheckCircle, FaBan } from "react-icons/fa";
import { MdInfo } from "react-icons/md";

export default function DropDownMenuSchedule({
  idAbsensi,
  defaultname,
  Status,
}: {
  idAbsensi: string;
  defaultname: string;
  Status: number;
}) {
  const { selectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      idAbsensiStudent,
      Status,
    }: {
      idUserClassroom: string;
      idAbsensiStudent: string;
      Status: number;
    }) => updateAbsensi(idUserClassroom, idAbsensiStudent, Status),
    onSuccess: () => {
      toast.success(`Update Absensi successfully!`);
      queryClient.invalidateQueries({
        queryKey: ["attedance", selectedClassName],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  const handleUpdate = (newStatus: number) => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      idAbsensiStudent: idAbsensi as string,
      Status: newStatus,
    });
  };

  return (
    <>
      <div className="hidden">{idAbsensi}</div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsisV />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-w-[150px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-800"
        >
          <DropdownMenuLabel>{defaultname}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={Status === 1}
            onClick={() => handleUpdate(1)}
          >
            <FaCheckCircle className="text-green-500 mr-2 h-4 w-4" />
            <span className="text-green-500">Hadir</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={Status === 2}
            onClick={() => handleUpdate(2)}
          >
            <MdInfo className="text-gray-500 mr-2 h-4 w-4" />
            <span className="text-gray-500">Ijin</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={Status === 0}
            onClick={() => handleUpdate(0)}
          >
            <FaBan className="text-red-500 mr-2 h-4 w-4" />
            <span className="text-red-500">Alfa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
