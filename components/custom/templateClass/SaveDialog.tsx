import { patchTemplate } from "@/actions/TemplateClassAction";
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

export default function SaveDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
  content,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
}) {
  const { selectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      content,
    }: {
      idUserClassroom: string;
      content: string;
    }) => patchTemplate(idUserClassroom, content),
    onSuccess: () => {
      toast.success("Template Update successfully!");
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["template", selectedClassName],
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  // Handler untuk tombol "Archive Class"
  const handleUopdateTemplate = () => {
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
      content: content,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Template</DialogTitle>
          <DialogDescription>
            Are you sure you want to Save this Template Mesaage?.
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
            onClick={handleUopdateTemplate} // Panggil handler mutasi
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
