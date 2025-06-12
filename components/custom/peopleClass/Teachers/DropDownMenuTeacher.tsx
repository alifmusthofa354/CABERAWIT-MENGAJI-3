"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FaEllipsisV, FaExchangeAlt, FaUserMinus, FaBan } from "react-icons/fa";

import StatusDialog from "./StatusDialog";
import BannedDialog from "./BannedDialog";
import DeleteDialog from "./DeleteDialog";

export default function DropDownMenuTeacher({
  idPeople,
  isActive,
  namePeople,
}: {
  idPeople: string;
  isActive: boolean;
  namePeople: string;
}) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBannedDialogOpen, setIsBannedDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsisV />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsStatusDialogOpen(true)}>
            <FaExchangeAlt className="mr-2 h-4 w-4" />
            Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <FaUserMinus className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Remove</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsBannedDialogOpen(true)}>
            <FaBan className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-red-600">Ban</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StatusDialog
        open={isStatusDialogOpen}
        onOpenChange={() => setIsStatusDialogOpen(false)}
        idPeople={idPeople}
        isActive={isActive}
        namePeople={namePeople}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        idPeople={idPeople}
        namePeople={namePeople}
      />
      <BannedDialog
        open={isBannedDialogOpen}
        onOpenChange={() => setIsBannedDialogOpen(false)}
        idPeople={idPeople}
        namePeople={namePeople}
      />
    </>
  );
}
