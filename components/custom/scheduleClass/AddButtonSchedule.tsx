"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddDialog from "./AddDialog";

export default function AddButtonSchedule({ idClass }: { idClass: number }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <div>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-md"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>

      <AddDialog
        open={isAddDialogOpen}
        onOpenChange={() => setIsAddDialogOpen(false)}
        idClass={idClass}
      />
    </>
  );
}
