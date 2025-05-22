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
  idClass,
  isActive,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idClass: number;
  isActive: boolean;
}) {
  const dialogTitle = isActive ? "Deactivate Teacher" : "Activate Teacher";
  const dialogDescription = isActive
    ? `Are you sure you want to deactivate this Teacher (ID: ${idClass})? It will no longer be active.`
    : `Are you sure you want to activate this Teacher (ID: ${idClass})? It will become active.`;
  const buttonText = isActive ? "Deactivate" : "Activate";
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
          >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
