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
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="default" // Warna merah untuk aksi delete
            >
              Archieved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
