"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";

export default function DropDownMenuSchedule({
  idClass,
  defaultname,
}: {
  idClass: string;
  defaultname: string;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsisV />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <FaEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <FaTrash className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={() => setIsEditDialogOpen(false)}
        idClass={idClass}
        defaultname={defaultname}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        idClass={idClass}
        defaultname={defaultname}
      />
    </>
  );
}
