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
  nameClass,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idClass: string;
  nameClass: string;
}) {
  return (
    <>
      <span hidden>{idClass}</span>
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
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive" // Warna merah untuk aksi delete
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
