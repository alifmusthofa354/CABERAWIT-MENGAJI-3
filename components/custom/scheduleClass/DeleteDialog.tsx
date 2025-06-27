import { deleteSchedule } from "@/actions/ScheduleClassAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import toast from "react-hot-toast";

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

export default function DeleteDialog({
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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      idSchedule,
    }: {
      idUserClassroom: string;
      idSchedule: string;
    }) => deleteSchedule(idUserClassroom, idSchedule),
    onSuccess: () => {
      toast.success(`Delete schedule successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["schedule", selectedClassName],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  // Handler untuk tombol "Archive Class"
  const handleDelete = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      idSchedule: idClass,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Schedule {defaultname}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {defaultname}? This action cannot be
            undone. Deleting Schedule will permanently remove it.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive" // Tetap menggunakan warna merah karena ini adalah tindakan "penghapusan" (meskipun soft)
            onClick={handleDelete} // Panggil handler mutasi
            disabled={mutation.isPending} // Nonaktifkan tombol saat mutasi berjalan
          >
            {mutation.isPending ? "Deleting..." : "Delete Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
