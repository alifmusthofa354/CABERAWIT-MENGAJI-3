"use client";
import { joinGeneralClassID } from "@/actions/GeneralClass";
import useStore from "@/stores/useStoreClass";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinClass({
  onCloseDialog,
}: {
  onCloseDialog: () => void;
}) {
  const { updateSelectedClassName } = useStore();
  const [codeClass, setCodeClass] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ codeClass }: { codeClass: string }) =>
      joinGeneralClassID(codeClass),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classroom"] });
      toast.success("join class successfully!");
      updateSelectedClassName(data.data.id);
      onCloseDialog();
    },
    onError: (error: Error) => {
      console.error("join error : ", error);
      toast.error(error.message);
    },
  });

  const handleJoinClass = () => {
    if (codeClass) {
      mutation.mutate({ codeClass });
    } else {
      toast.error("Code kelas tidak boleh kosong!");
    }
  };

  return (
    <>
      <DialogHeader className="mt-3">
        <DialogTitle className="text-center">Join Class</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4 my-4">
        <Label htmlFor="codeclass" className="text-right">
          Code Kelas
        </Label>
        <Input
          id="codeclass"
          value={codeClass}
          onChange={(e) => setCodeClass(e.target.value)} // Menangani perubahan input
          className="col-span-3"
          placeholder="Masukan code kelas disini!"
          required
        />
      </div>

      <DialogFooter className="sm:justify-end">
        <Button
          variant="default"
          onClick={handleJoinClass} // Panggil handler mutasi
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? "Joining..." : "Join Class"}
        </Button>
      </DialogFooter>
    </>
  );
}
