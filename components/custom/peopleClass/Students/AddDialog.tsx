"use client";
import { AddStudent } from "@/actions/PeopleClassAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import useStore from "@/stores/useStoreClass";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import ImageUpload from "../../ImageUpload";

export default function AddDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { selectedClassName } = useStore();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null); // State untuk menyimpan file gambar
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Untuk menampilkan preview gambar
  const [imageError, setImageError] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      formData,
    }: {
      idUserClassroom: string;
      formData: FormData;
    }) => AddStudent(idUserClassroom, formData),
    onSuccess: () => {
      toast.success(`Update student successfully!`);
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["students", selectedClassName],
      });
      setName("");
      setImage(null);
      setImagePreviewUrl(null);
      setImageError(false);
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Membuat URL sementara untuk preview
      setImageError(false);
    } else {
      setImage(null);
      setImagePreviewUrl(null);
      setImageError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      const formData = new FormData();
      formData.append("name", name || "");
      formData.append("image", image || "");
      const idUserClassroom = selectedClassName as string;
      mutation.mutate({ idUserClassroom, formData });
    } else {
      toast.error("Tolong isi nama siswa");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Create Student here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Menangani perubahan input
              className="col-span-3"
              required
            />
          </div>

          {/* Input untuk upload gambar */}
          <div className="grid grid-cols-4 items-center gap-4">
            <ImageUpload
              onImageSelected={handleImageChange}
              maxFileSizeMB={3}
              allowedMimeTypes={["image/jpeg", "image/png", "image/webp"]}
              // maxWidth={1920}
              // maxHeight={1080}
            />
          </div>
          {/* Preview gambar */}
          {!imageError && (
            <div className="grid grid-cols-1 items-center ">
              {imagePreviewUrl && (
                <Image
                  src={imagePreviewUrl}
                  alt="Image Preview"
                  className="max-h-32 rounded-md"
                  height={500}
                  width={500}
                />
              )}
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"default"}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
