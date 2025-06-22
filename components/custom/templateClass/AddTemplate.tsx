import { addTemplate } from "@/actions/TemplateClassAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import toast from "react-hot-toast";

import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Button } from "@/components/ui/button";

export default function AddTemplate() {
  const { selectedClassName } = useStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ idUserClassroom }: { idUserClassroom: string }) =>
      addTemplate(idUserClassroom),
    onSuccess: () => {
      toast.success("Template Add successfully!");
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
  const handleAddTemplate = () => {
    mutation.mutate({
      idUserClassroom: selectedClassName as string,
    });
  };

  return (
    <>
      <div className="min-h-svh bg-gray-50 @container flex flex-col">
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <SelectClass />
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="flex flex-col text-center justify-center items-center">
            <p>
              Tidak ada template yang ditemukan. Silakan Buat template terlebih
              dahulu.
            </p>

            <div>
              <Button
                variant="destructive"
                className=" transition-all duration-300 transform hover:scale-105 active:scale-95 "
                onClick={handleAddTemplate}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adding..." : "Add Template"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
