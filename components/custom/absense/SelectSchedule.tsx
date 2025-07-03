"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fetchingSchedule } from "@/actions/ScheduleClassAction";
import useScheduleStore from "@/stores/useStoreSchedule";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// --- Definisi Tipe ---
type ScheduleType = {
  id: string;
  name: string;
};

// Interface yang mencerminkan SEMUA kemungkinan respons dari backend
type ApiResponeType = {
  message?: string; // Hanya ada jika skenario "belum ada kelas"
  action?: string; // Hanya ada jika skenario "belum ada kelas"
  data?: null; // Hanya ada jika skenario "belum ada kelas"
  schedules?: ScheduleType[]; // Ada jika skenario "ada kelas" (bisa kosong atau berisi)
  idClassCurrent?: string;
  error?: string; // Untuk error dari backend
};

export default function SelectSchedule() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { selectedClassName } = useStore();
  const { selectedScheduleName, updateSelectedScheduleName } =
    useScheduleStore();

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery<ApiResponeType, Error>({
    queryKey: ["schedule", selectedClassName],
    queryFn: () => fetchingSchedule(selectedClassName as string),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (apiResponse && apiResponse.idClassCurrent) {
      if (apiResponse.idClassCurrent !== selectedClassName) {
        queryClient.setQueryData(
          ["schedule", apiResponse.idClassCurrent],
          apiResponse
        );
      }
    }
  }, [selectedClassName, apiResponse, queryClient]);

  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  if (isLoading)
    return (
      <>
        <Button disabled className="min-w-full">
          <Loader2 className="animate-spin" />
          Please wait
        </Button>
      </>
    );

  if (isError) {
    return (
      <>
        <Button
          variant="destructive"
          className="min-w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          onClick={handleRetry} // Tambahkan onClick di sini
        >
          Coba Lagi
        </Button>
      </>
    );
  }

  // 1. Skenario: Belum ada kelas yang dibuat
  if (
    apiResponse &&
    apiResponse.message &&
    apiResponse.action === "create_class"
  ) {
    return (
      <>
        <Button
          variant="default"
          className="min-w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          onClick={() => router.push("/dashboard")} // Tambahkan onClick di sini
        >
          Buat kelas terlebih dahulu
        </Button>
      </>
    );
  }

  if (
    apiResponse &&
    apiResponse.schedules &&
    apiResponse.schedules.length === 0
  ) {
    return (
      <>
        <Button
          variant="default"
          className="min-w-full transition-all duration-300 transform hover:scale-105 active:scale-95"
          onClick={() => router.push("/dashboard/kelas/schedule")} // Tambahkan onClick di sini
        >
          Buat jadwal terlebih dahulu
        </Button>
      </>
    );
  }

  if (
    apiResponse &&
    apiResponse.schedules &&
    apiResponse.schedules.length > 0
  ) {
    return (
      <>
        <div className="grid grid-cols-1  gap-4 mb-4">
          <div>
            <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
            <Select
              value={selectedScheduleName || ""}
              onValueChange={updateSelectedScheduleName}
            >
              <SelectTrigger className="min-w-full truncate">
                <SelectValue placeholder="Pilih Kegiatan" />
              </SelectTrigger>
              <SelectContent className="text-truncate">
                {apiResponse.schedules.map((schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </>
    );
  }

  // Fallback jika respons tidak sesuai ekspektasi (jarang terjadi jika backend konsisten)
  return <div>Tidak dapat menampilkan data. Format respons tidak dikenal.</div>;
}
