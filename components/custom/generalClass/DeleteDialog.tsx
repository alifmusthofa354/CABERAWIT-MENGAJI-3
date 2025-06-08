import { DeleteStatusClass } from "@/actions/GeneralClass";
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
  idUserClassroom,
  nameClass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idUserClassroom: string;
  nameClass: string;
}) {
  const { updateSelectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ idUserClassroom }: { idUserClassroom: string }) =>
      DeleteStatusClass(idUserClassroom),
    onSuccess: () => {
      toast.success("Class deleted successfully!");
      onOpenChange(false);
      queryClient.removeQueries({ queryKey: ["classroom"] });
      queryClient.removeQueries({
        queryKey: ["userClasses", idUserClassroom],
      });
      queryClient.removeQueries({
        queryKey: ["userClasses", null],
      });
      updateSelectedClassName(null);
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  // Handler untuk tombol "Archive Class"
  const handleDeleteClass = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({ idUserClassroom: idUserClassroom });
  };

  return (
    <>
      <span hidden>{idUserClassroom}</span>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete {nameClass}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold"> {nameClass}</span>? This action
              cannot be undone. Deleting Class will permanently remove it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={mutation.isPending} // Nonaktifkan tombol saat mutasi berjalan
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive" // Tetap menggunakan warna merah karena ini adalah tindakan "penghapusan" (meskipun soft)
              onClick={handleDeleteClass} // Panggil handler mutasi
              disabled={mutation.isPending} // Nonaktifkan tombol saat mutasi berjalan
            >
              {mutation.isPending ? "Deleting..." : "Delete Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
