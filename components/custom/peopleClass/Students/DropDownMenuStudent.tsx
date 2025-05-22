"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaEllipsisV, FaEdit, FaTrash, FaExchangeAlt } from "react-icons/fa";

import EditDialog from "./EditDialog";
import StatusDialog from "./StatusDialog";
import DeleteDialog from "./DeleteDialog";

export default function DropDownMenuTeacher({
  idClass,
  isActive,
}: {
  idClass: number;
  isActive: boolean;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
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
          <DropdownMenuItem onClick={() => setIsStatusDialogOpen(true)}>
            <FaExchangeAlt className="mr-2 h-4 w-4" />
            Status
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
      />
      <StatusDialog
        open={isStatusDialogOpen}
        onOpenChange={() => setIsStatusDialogOpen(false)}
        idClass={idClass}
        isActive={isActive}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        idClass={idClass}
      />
    </>
  );
}
