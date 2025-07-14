import { deleteAttedance } from "@/actions/AbsensiAction";
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
  idAttedance,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idAttedance: string;
}) {
  const { selectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      idAttedance,
    }: {
      idUserClassroom: string;
      idAttedance: string;
    }) => deleteAttedance(idUserClassroom, idAttedance),
    onSuccess: () => {
      toast.success(`Delete Attedance successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["attedance", selectedClassName],
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
      idAttedance: idAttedance,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Attedance</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Attedance? This action cannot be
            undone. Deleting Attedance will permanently remove it.
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
            {mutation.isPending ? "Deleting..." : "Delete Attedance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
