import { changeStatusClass } from "@/actions/GeneralClass";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  idUserClassroom,
  isActive,
  nameClass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idUserClassroom: string;
  isActive: boolean;
  nameClass: string;
}) {
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
      const valueStatus = isActive ? "non active" : "active";
      toast.success(`Class ${nameClass} ${valueStatus} successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["classroom"] });
      queryClient.invalidateQueries({
        queryKey: ["userClasses", idUserClassroom],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  const dialogTitle = isActive
    ? `Deactivate ${nameClass}`
    : `Activate ${nameClass}`;
  const dialogDescription = isActive
    ? `Are you sure you want to deactivate ${nameClass}? It will no longer be active.`
    : `Are you sure you want to activate ${nameClass})? It will become active.`;
  const buttonText = isActive ? "Deactivate Class" : "Activate Class";
  const buttonTextPending = isActive ? "Deactivating ..." : "Activating ...";
  const buttonVariant = isActive ? "secondary" : "default";
  const newStatus = isActive ? "NON ACTIVE" : "ACTIVE";

  // Handler untuk tombol "Change Status Class"
  const handleStatusClass = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({ idUserClassroom: idUserClassroom, status: newStatus });
  };

  return (
    <>
      <span hidden>{idUserClassroom}</span>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>{dialogDescription}</DialogDescription>
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
              variant={buttonVariant}
              className={isActive ? "bg-gray-300 hover:bg-gray-200" : ""}
              onClick={handleStatusClass}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? buttonTextPending : buttonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
