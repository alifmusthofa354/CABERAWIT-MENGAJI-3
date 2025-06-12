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

export default function StatusDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
  idPeople,
  isActive,
  namePeople,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idPeople: string;
  isActive: boolean;
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
      const valueStatus = isActive ? "Deactivation" : "Activation";
      toast.success(`${valueStatus} teacher successfully!`);
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

  const handleStatusPeople = () => {
    // Panggil mutasi dengan idUserClassroom dan nilai status arsip
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      status: isActive ? "NON ACTIVE" : "ACTIVE",
      idPeopleUpdate: idPeople,
    });
  };

  const dialogTitle = isActive ? "Deactivate Teacher" : "Activate Teacher";
  const dialogDescription = isActive
    ? `Are you sure you want to deactivate ${namePeople} ? It will no longer be active.`
    : `Are you sure you want to activate ${namePeople} ? It will become active.`;
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
            onClick={handleStatusPeople}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? buttonTextPending : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
