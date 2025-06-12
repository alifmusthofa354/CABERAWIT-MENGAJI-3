import { PatchPeople } from "@/actions/PeopleClassAction";
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
  idPeople,
  namePeople,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idPeople: string;
  namePeople: string;
}) {
  const { selectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      status,
      idPeopleUpdate,
    }: {
      idUserClassroom: string;
      status: string;
      idPeopleUpdate: string;
    }) => PatchPeople(idUserClassroom, status, idPeopleUpdate),
    onSuccess: () => {
      toast.success(`Remove teacher successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["people", selectedClassName],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  const handleRemovePeople = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      status: "REMOVE",
      idPeopleUpdate: idPeople,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove Teacher {namePeople}</DialogTitle>
          <DialogDescription>
            Are you sure you want to{" "}
            <span className="font-bold">Remove {namePeople}</span>? This action
            cannot be undone. Removing this teacher will permanently delete
            their access from this class.
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
            onClick={handleRemovePeople} // Panggil handler mutasi
            disabled={mutation.isPending} // Nonaktifkan tombol saat mutasi berjalan
          >
            {mutation.isPending ? "Removing..." : "Remove Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
