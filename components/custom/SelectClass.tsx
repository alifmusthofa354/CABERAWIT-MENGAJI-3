"use client";

import useStore from "@/stores/useStoreClass";
import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "@/actions/ClassActions";
import AddClass from "@/components/custom/AddClass";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Class {
  id: string;
  id_class: string;
  email: string;
  isOwner: boolean;
  status: number;
  classroom: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    kode: string;
    link_wa: string;
    status: number;
  };
}

export default function SelectClass() {
  const {
    data: classes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Class[], Error>({
    queryKey: ["classroom"],
    queryFn: fetchClasses,
  });

  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  const { selectedClassName, updateSelectedClassName } = useStore();

  if (isLoading)
    return (
      <>
        <Button disabled>
          <Loader2 className="animate-spin" />
          Please wait
        </Button>
      </>
    );

  if (isError) {
    const noClassroom = error.message === "No classroom";

    return (
      <>
        {noClassroom ? (
          <AddClass />
        ) : (
          <Button
            variant="destructive"
            className=" transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={handleRetry} // Tambahkan onClick di sini
          >
            Coba Lagi
          </Button>
        )}
      </>
    );
  }

  return (
    <>
      <Select
        value={selectedClassName ?? ""}
        onValueChange={updateSelectedClassName}
      >
        <SelectTrigger className="max-w-[200px] truncate">
          <SelectValue placeholder="Pilih Kelas" />
        </SelectTrigger>
        <SelectContent className="text-truncate">
          {classes && classes.length > 0 ? (
            classes.map((kelas) => (
              <SelectItem key={kelas.id} value={kelas.id}>
                {kelas.classroom.name}
              </SelectItem>
            ))
          ) : (
            <AddClass />
          )}
        </SelectContent>
      </Select>
    </>
  );
}
