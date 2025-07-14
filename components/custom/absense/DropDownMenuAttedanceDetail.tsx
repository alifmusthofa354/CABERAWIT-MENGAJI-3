"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

import DeleteDialog from "./DeleteDialog";

export default function DropDownMenuAttedanceDetail({
  idAttedance,
}: {
  idAttedance: string;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter(); // Inisialisasi hook useRouter

  const handleButtonClick = () => {
    router.push("/dashboard/absensi/create");
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsisV />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white border border-white"
        >
          <DropdownMenuItem
            onClick={handleButtonClick}
            className="
     text-white 
    hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600
    active:bg-gradient-to-br active:from-indigo-500 active:to-purple-600
    focus:bg-gradient-to-br focus:from-indigo-500 focus:to-purple-600
    cursor-pointer
  "
          >
            <FaEdit className="mr-2 h-4 w-4 text-white" />
            <span className="text-white">Create</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="
     text-white 
    hover:bg-gradient-to-br hover:from-indigo-500 hover:to-purple-600
    active:bg-gradient-to-br active:from-indigo-500 active:to-purple-600
    focus:bg-gradient-to-br focus:from-indigo-500 focus:to-purple-600
    cursor-pointer
  "
          >
            <FaTrash className="mr-2 h-4 w-4 text-red-300" />
            <span className="text-red-100">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        idAttedance={idAttedance}
      />
    </>
  );
}
