"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

// Fungsi untuk membuat kelas
const createClass = async (formData: { name: string }) => {
  const response = await axios.post("/api/learning/classroom", formData);
  return response.data;
};

export default function AddClass() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false); // State untuk mengontrol dialog
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroom"] });
      toast.success("Class created successfully!");
      setName(""); // Reset state nama
      setOpen(false); // Tutup dialog
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      mutation.mutate({ name });
    }
  };

  return (
    <>
      <Toaster /> {/* Tempatkan Toaster di luar Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <span>
              <Plus />
            </span>
            Create Class
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Class</DialogTitle>
            <DialogDescription>
              Enter the class details and click save when you are done.
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
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add Class"}
              </Button>
            </DialogFooter>
          </form>
          {/* Form End */}
        </DialogContent>
      </Dialog>
    </>
  );
}
