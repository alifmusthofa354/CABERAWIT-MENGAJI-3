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

type ClassroomDetails = {
  name: string;
  description: string;
  image_url: string;
  kode: string;
  link_wa: string;
  status: number; // -1: delete0: non-aktif, 1: aktif, 2: arsip
};

type UserClassroom = {
  id: string; // id dari user_classroom
  isOwner: boolean;
  classroom: ClassroomDetails; // 'classroom' tidak lagi bersifat opsional karena sudah difilter di backend
};

export default function DropDownMenu({
  mainClass,
}: {
  mainClass: UserClassroom;
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
        idUserClassroom={mainClass?.id || ""}
        nameClass={mainClass?.classroom.name || ""}
        codeClass={mainClass?.classroom.kode || ""}
      />
      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={() => setIsEditDialogOpen(false)}
        idUserClassroom={mainClass?.id || ""}
        nameClass={mainClass?.classroom.name || ""}
        descriptionClass={mainClass?.classroom.description || ""}
        image_url={mainClass?.classroom.image_url || ""}
        link_wa={mainClass?.classroom.link_wa || ""}
      />
      <StatusDialog
        open={isStatusDialogOpen}
        onOpenChange={() => setIsStatusDialogOpen(false)}
        idUserClassroom={mainClass?.id || ""}
        isActive={mainClass?.classroom.status === 1}
        nameClass={mainClass?.classroom.name || ""}
      />
      <ArchieveDialog
        open={isArchieveDialogOpen}
        onOpenChange={() => setIsArchieveDialogOpen(false)}
        idUserClassroom={mainClass?.id || ""}
        nameClass={mainClass?.classroom.name || ""}
      />
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        idUserClassroom={mainClass?.id || ""}
        nameClass={mainClass?.classroom.name || ""}
      />
    </>
  );
}
