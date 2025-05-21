"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  FaShareAlt,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaExchangeAlt,
  FaArchive,
} from "react-icons/fa";

import ShareDialog from "./ShareDialog";
import EditDialog from "./EditDialog";
import StatusDialog from "./StatusDialog";
import ArchieveDialog from "./ArchieveDialog";
import DeleteDialog from "./DeleteDialog";

export default function DropDownMenu({
  idClass,
  isActive,
}: {
  idClass: number;
  isActive: boolean;
}) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isArchieveDialogOpen, setIsArchieveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <FaEllipsisV />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
            <FaShareAlt className="mr-2 h-4 w-4 " />
            Shared
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <FaEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsStatusDialogOpen(true)}>
            <FaExchangeAlt className="mr-2 h-4 w-4" />
            Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsArchieveDialogOpen(true)}>
            <FaArchive className="mr-2 h-4 w-4" />
            Archieve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            <FaTrash className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={() => setIsShareDialogOpen(false)}
        idClass={idClass}
      />
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
      <ArchieveDialog
        open={isArchieveDialogOpen}
        onOpenChange={() => setIsArchieveDialogOpen(false)}
        idClass={idClass}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        idClass={idClass}
      />
    </>
  );
}
