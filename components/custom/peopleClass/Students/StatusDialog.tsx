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

export default function StatusDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
  idStudent,
  isActive,
  name,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idStudent: string;
  isActive: boolean;
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
      const valueStatus = isActive ? "Deactivation" : "Activation";
      toast.success(`${valueStatus} students successfully!`);
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
  const handleStatusStudent = () => {
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      status: isActive ? "NON ACTIVE" : "ACTIVE",
      idStudentUpdate: idStudent,
    });
  };

  const dialogTitle = isActive ? "Deactivate Student" : "Activate Student";
  const dialogDescription = isActive
    ? `Are you sure you want to deactivate ${name}? It will no longer be active.`
    : `Are you sure you want to activate ${name}? It will become active.`;
  const buttonText = isActive ? "Deactivate" : "Activate";
  const buttonTextPending = isActive ? "Deactivating ..." : "Activating ...";
  const buttonVariant = isActive ? "secondary" : "default";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={buttonVariant}
            className={isActive ? "bg-gray-300 hover:bg-gray-200" : ""}
            onClick={handleStatusStudent}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? buttonTextPending : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
