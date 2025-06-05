import { changeStatusClass } from "@/actions/GeneralClass";
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

export default function ArchieveDialog({
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
    mutationFn: ({
      idUserClassroom,
      status,
    }: {
      idUserClassroom: string;
      status: string;
    }) => changeStatusClass(idUserClassroom, status),
    onSuccess: () => {
      toast.success("Class archieved successfully!");
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
  const handleArchieveClass = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({ idUserClassroom: idUserClassroom, status: "ARCHIVE" });
  };

  return (
    <>
      <span hidden>{idUserClassroom}</span>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archieve {nameClass}</DialogTitle>
            <DialogDescription>
              Are you sure you want to archieve{" "}
              <span className="font-bold"> {nameClass}</span>? This action
              cannot be undone to active again. Archieve Class will make class
              to be read only!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="default" // Tetap menggunakan warna merah karena ini adalah tindakan "penghapusan" (meskipun soft)
              onClick={handleArchieveClass} // Panggil handler mutasi
              disabled={mutation.isPending} // Nonaktifkan tombol saat mutasi berjalan
            >
              {mutation.isPending ? "Archieving..." : "Archive Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
