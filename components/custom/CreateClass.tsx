"use client";
import useStore from "@/stores/useStoreClass";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import ImageUpload from "./ImageUpload";

const postCreateClass = async (formData: FormData) => {
  const response = await axios.post(
    "/api/learning/classroom/generalclass",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }, // Penting untuk mengirim file
    }
  );
  return response.data;
};

export default function CreateClass({
  onCloseDialog,
}: {
  onCloseDialog: () => void;
}) {
  const { updateSelectedClassName } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // State untuk input keterangan
  const [waGrup, setwaGrup] = useState("");
  const [image, setImage] = useState<File | null>(null); // State untuk menyimpan file gambar
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // Untuk menampilkan preview gambar
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postCreateClass,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["classroom"] });
      toast.success("Class created successfully!");
      setName(""); // Reset state nama
      setDescription(""); // Reset state keterangan
      setwaGrup("");
      setImage(null);
      setImagePreviewUrl(null);
      updateSelectedClassName(data.id);
      onCloseDialog();
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const responseData = axiosError.response.data;

          // Type guard untuk memastikan responseData adalah object.
          if (
            typeof responseData === "object" &&
            responseData &&
            "error" in responseData &&
            Array.isArray(responseData.error)
          ) {
            const zodErrors = responseData.error as { message: string }[]; // Type Assertion
            zodErrors.forEach((zodError) => {
              toast.error(zodError.message);
            });
          } else {
            toast.error("Failed to create class.");
          }
        } else {
          toast.error("An unexpected network error occurred.");
        }
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file)); // Membuat URL sementara untuk preview
    } else {
      setImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && description && waGrup && image) {
      // Memastikan name, description, dan image ada
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("waGrup", waGrup);
      formData.append("image", image); // Append file gambar ke FormData
      mutation.mutate(formData);
    } else {
      // Handle kasus jika ada field yang kosong, misalnya menampilkan toast error
      let missingFields = "";
      if (!name) missingFields += "Name, ";
      if (!description) missingFields += "Description, ";
      if (!waGrup) missingFields += "waGrup, ";
      if (!image) missingFields += "Image, ";
      toast.error(
        "Please fill in all required fields: " +
          missingFields.slice(0, -2) +
          "."
      );
    }
  };

  return (
    <>
      <DialogHeader className="mt-3">
        <DialogTitle className="text-center">Buat Kelas Baru</DialogTitle>
        <DialogDescription>
          Masukan Nama, Keterangan dan gambar Kelas
        </DialogDescription>
      </DialogHeader>

      {/* Form Start */}
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
        {/* Input untuk keterangan */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
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
            value={waGrup}
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
        {imagePreviewUrl && (
          <div className="grid grid-cols-1 items-center ">
            <Image
              src={imagePreviewUrl}
              alt="Image Preview"
              className="max-h-32 rounded-md"
              height={500}
              width={500}
            />
          </div>
        )}

        <DialogFooter>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Buat..." : "Buat Kelas Baru"}
          </Button>
        </DialogFooter>
      </form>
      {/* Form End */}
    </>
  );
}
