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
import { ImSpinner2 } from "react-icons/im";

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
    onMutate: () => {
      toast.loading("Memperbarui absensi...", { id: "updateAbsensi" });
    },
    onSuccess: () => {
      toast.success(`Update Absensi successfully!`, { id: "updateAbsensi" });
      queryClient.invalidateQueries({
        queryKey: ["attedance", selectedClassName],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(
        `Gagal update absensi: ${
          error.message || "Terjadi kesalahan tidak terduga."
        }`,
        { id: "updateAbsensi" }
      );
    },
  });

  const handleUpdate = (newStatus: number) => {
    // Gunakan isPending
    if (mutation.isPending) return;

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
        {/* Gunakan isPending */}
        <DropdownMenuTrigger disabled={mutation.isPending}>
          {mutation.isPending ? (
            <ImSpinner2 className="animate-spin h-4 w-4" />
          ) : (
            <FaEllipsisV />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-w-[150px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-800"
        >
          <DropdownMenuLabel>{defaultname}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            // Gunakan isPending
            disabled={Status === 1 || mutation.isPending}
            onClick={() => handleUpdate(1)}
          >
            <FaCheckCircle className="text-green-500 mr-2 h-4 w-4" />
            <span className="text-green-500">Hadir</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // Gunakan isPending
            disabled={Status === 2 || mutation.isPending}
            onClick={() => handleUpdate(2)}
          >
            <MdInfo className="text-gray-500 mr-2 h-4 w-4" />
            <span className="text-gray-500">Ijin</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            // Gunakan isPending
            disabled={Status === 0 || mutation.isPending}
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
