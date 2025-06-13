import { PatchStudent } from "@/actions/PeopleClassAction";
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
  idStudent,
  name,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idStudent: string;
  name: string;
}) {
  const { selectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      status,
      idStudentUpdate,
    }: {
      idUserClassroom: string;
      status: string;
      idStudentUpdate: string;
    }) => PatchStudent(idUserClassroom, status, idStudentUpdate),
    onSuccess: () => {
      toast.success(`Delete student successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["students", selectedClassName],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  // Handler untuk tombol "Archive Class"
  const handleDeleteStudent = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      status: "DELETE",
      idStudentUpdate: idStudent,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-bold">{name}</span> ? This action cannot be
            undone. Deleting Student will permanently remove it.
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
            onClick={handleDeleteStudent} // Panggil handler mutasi
            disabled={mutation.isPending} // Nonaktifkan tombol saat mutasi berjalan
          >
            {mutation.isPending ? "Deleting..." : "Delete Students"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
