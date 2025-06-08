"use client";
import { updateGeneralClassID } from "@/actions/GeneralClass";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import ImageUpload from "../ImageUpload";

export default function EditDialog({
  open, // Menerima prop 'open'
  onOpenChange, // Menerima prop 'onOpenChange'
  idUserClassroom,
  nameClass,
  descriptionClass,
  link_wa,
  image_url,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idUserClassroom: string;
  nameClass: string;
  descriptionClass: string;
  link_wa: string;
  image_url: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // State untuk input keterangan
  const [waGrup, setwaGrup] = useState("");
  const [image, setImage] = useState<File | null>(null); // State untuk menyimpan file gambar
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Untuk menampilkan preview gambar
  const [imageError, setImageError] = useState<boolean>(false);

  const nameDefault = nameClass || "Class Name";
  const descriptionDefault = descriptionClass || "Class Description";
  const waGrupDefault = link_wa || "Link WA Group";
  const imageDefault = image_url || "/default.png";

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      formData,
      isPut = false,
    }: {
      idUserClassroom: string;
      formData: FormData;
      isPut?: boolean;
    }) => updateGeneralClassID(idUserClassroom, formData, isPut),
    onSuccess: () => {
      toast.success("Class Updated successfully!");
      onOpenChange(false);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["classroom"] });
      queryClient.invalidateQueries({
        queryKey: ["userClasses", idUserClassroom],
      });
      setName("");
      setDescription("");
      setwaGrup("");
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
    const formData = new FormData();
    if (image) {
      formData.append("name", name || nameDefault);
      formData.append("description", description || descriptionDefault);
      formData.append("waGrup", waGrup || waGrupDefault);
      formData.append("image", image);
      mutation.mutate({ idUserClassroom, formData, isPut: true });
      return;
    }
    if (name && name !== nameDefault) {
      formData.append("name", name);
    }
    if (description && description !== descriptionDefault) {
      formData.append("description", description);
    }
    if (waGrup && waGrup !== waGrupDefault) {
      formData.append("waGrup", waGrup);
    }
    if (Array.from(formData.keys()).length === 0) {
      toast.error("Not Changed Any Data");
      return;
    }
    mutation.mutate({ idUserClassroom, formData });
  };

  return (
    <>
      <span hidden>{idUserClassroom}</span>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {nameClass}</DialogTitle>
            <DialogDescription>
              Make changes to your class here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue={name ? name : nameDefault}
                onChange={(e) => setName(e.target.value)} // Menangani perubahan input
                className="col-span-3"
                required
              />
            </div>
            {/* Input untuk keterangan */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                defaultValue={description ? description : descriptionDefault}
                onChange={(e) => setDescription(e.target.value)} // Menangani perubahan input keterangan
                className="col-span-3"
              />
            </div>
            {/* Input untuk Link */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="waGrup" className="text-right">
                WA Grup
              </Label>
              <Input
                id="waGrup"
                defaultValue={waGrup ? waGrup : waGrupDefault}
                type="url"
                onChange={(e) => setwaGrup(e.target.value)} // Menangani perubahan input keterangan
                className="col-span-3"
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
                <Image
                  src={imagePreviewUrl ? imagePreviewUrl : imageDefault}
                  alt="Image Preview"
                  className="max-h-32 rounded-md"
                  height={500}
                  width={500}
                />
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
                {mutation.isPending ? "Saving..." : "Update Class"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
