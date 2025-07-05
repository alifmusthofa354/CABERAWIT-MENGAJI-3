"use client";
import { addAttedance } from "@/actions/AbsensiAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useStore from "@/stores/useStoreClass";
import useScheduleStore from "@/stores/useStoreSchedule";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export type Attendance = {
  id: string;
  name: string;
  status: "Hadir" | "Ijin" | "Alfa";
};

export default function SubmitAttedance({
  recordData,
}: {
  recordData: Attendance[];
}) {
  const router = useRouter();
  const { selectedClassName } = useStore();
  const { selectedScheduleName } = useScheduleStore();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      idUserClassroom,
      schedule,
      attedance,
    }: {
      idUserClassroom: string;
      schedule: string;
      attedance: Attendance[];
    }) => addAttedance(idUserClassroom, schedule, attedance),
    onSuccess: () => {
      toast.success(`Submit Absensi Successfully!`);
      queryClient.invalidateQueries({
        queryKey: ["attedance", selectedClassName],
      });
      router.push("/dashboard/absensi");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("An unexpected network error occurred.");
    },
  });

  const handleSubmit = () => {
    // Validasi awal untuk memastikan semua data dasar terisi
    if (
      !selectedClassName ||
      !selectedScheduleName ||
      !recordData ||
      recordData.length === 0
    ) {
      toast.error("Tolong isi semua bidang yang diperlukan.");
      return; // Hentikan eksekusi jika validasi gagal
    }

    // Jika mutasi sedang dalam proses (isPending) atau sudah berhasil (isSuccess),
    // jangan izinkan submit lagi.
    if (mutation.isPending || mutation.isSuccess) {
      return;
    }

    // Jika ada error dari percobaan sebelumnya, reset state mutasi sebelum mencoba lagi.
    // Ini akan mengubah `isError` menjadi `false` dan `isIdle` menjadi `true`,
    // sehingga tombol dapat ditekan kembali.
    if (mutation.isError) {
      mutation.reset();
    }

    // Type assertion yang lebih aman setelah validasi
    const idUserClassroom: string = selectedClassName;
    const schedule: string = selectedScheduleName;
    const attedance: Attendance[] = recordData;

    // Lakukan mutasi
    mutation.mutate({ idUserClassroom, schedule, attedance });
  };

  return (
    <>
      <Button
        type="submit"
        className="mt-8 min-w-full"
        onClick={handleSubmit}
        disabled={mutation.isPending || mutation.isSuccess}
      >
        {mutation.isPending ? "Loading..." : "Submit"}
      </Button>
    </>
  );
}
