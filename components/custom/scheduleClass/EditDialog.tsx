"use client";
import { patchSchedule } from "@/actions/ScheduleClassAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import useStore from "@/stores/useStoreClass";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
  idClass,
  defaultname,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idClass: string;
  defaultname: string;
}) {
  const { selectedClassName } = useStore();
  const [name, setName] = useState("");
  const nameDefault = defaultname || "Name";

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      name,
      idScheduleUpdate,
    }: {
      idUserClassroom: string;
      name: string;
      idScheduleUpdate: string;
    }) => patchSchedule(idUserClassroom, name, idScheduleUpdate),
    onSuccess: () => {
      toast.success(`Update schedule successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["schedule", selectedClassName],
      });
      setName("");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && name !== nameDefault) {
      const idUserClassroom = selectedClassName as string;
      const idScheduleUpdate = idClass as string;
      mutation.mutate({ idUserClassroom, name, idScheduleUpdate });
    } else {
      toast.error("Not Changed Any Data");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Schedule {nameDefault}</DialogTitle>
          <DialogDescription>
            Make changes data Schedule here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={name || nameDefault}
              onChange={(e) => setName(e.target.value)} // Menangani perubahan input
              className="col-span-3"
              required
            />
          </div>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"default"}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Updating..." : "Update Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
