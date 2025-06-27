"use client";
import { addSchedule } from "@/actions/ScheduleClassAction";
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

export default function AddDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { selectedClassName } = useStore();
  const [name, setName] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      name,
    }: {
      idUserClassroom: string;
      name: string;
    }) => addSchedule(idUserClassroom, name),
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
    if (name) {
      const idUserClassroom = selectedClassName as string;
      mutation.mutate({ idUserClassroom, name });
    } else {
      toast.error("Tolong isi nama jadwal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogDescription>
            Create Schedule here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
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
              {mutation.isPending ? "Adding..." : "Add Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
