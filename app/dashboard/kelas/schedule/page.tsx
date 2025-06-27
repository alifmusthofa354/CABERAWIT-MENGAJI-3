"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fetchingSchedule } from "@/actions/ScheduleClassAction";

import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Separator } from "@/components/ui/separator";
import { FaCalendarAlt } from "react-icons/fa";

import AddButtonSchedule from "@/components/custom/scheduleClass/AddButtonSchedule";
import DropDownMenuSchedule from "@/components/custom/scheduleClass/DropDownMenuSchedule";
import LoadingClass from "@/components/custom/LoadingClass";
import ErrorClass from "@/components/custom/ErrorClass";
import NoClass from "@/components/custom/NoClass";
import NoSchedule from "@/components/custom/scheduleClass/NoSchedule";

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

export default function Page() {
  const queryClient = useQueryClient();
  const { selectedClassName, updateSelectedClassName } = useStore();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
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
        updateSelectedClassName(apiResponse.idClassCurrent);
      }
    }
  }, [selectedClassName, apiResponse, queryClient, updateSelectedClassName]);

  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  if (isLoading) return <LoadingClass />;

  if (isError) return <ErrorClass error={error} handleRetry={handleRetry} />;

  // --- Penanganan Skenario di Frontend ---

  // 1. Skenario: Belum ada kelas yang dibuat
  if (
    apiResponse &&
    apiResponse.message &&
    apiResponse.action === "create_class"
  ) {
    return <NoClass />;
  }

  // 2. Skenario: Ada kelas, namun belum ada template
  //    (apiResponse.template ada, tapi array-nya kosong)
  if (
    apiResponse &&
    apiResponse.schedules &&
    apiResponse.schedules.length === 0
  ) {
    return <NoSchedule />;
  }

  // 3. Skenario: Ada kelas dan ada template
  //    (apiResponse.template ada dan berisi data)
  if (
    apiResponse &&
    apiResponse.schedules &&
    apiResponse.schedules.length > 0
  ) {
    return (
      <div className="min-h-svh bg-gray-50 @container">
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <SelectClass />
            </div>
          </div>
        </div>
        <div className=" mx-auto p-4 md:p-6 pb-18 md:pb-18  mt-1 min-h-max ">
          {/* Owner Section */}
          <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <FaCalendarAlt className="text-blue-600 text-2xl md:text-3xl mr-2" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                  Schedule
                </h1>
              </div>
              <div>
                {apiResponse.schedules.map((schedule) => (
                  <div key={schedule.id}>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <h3>{schedule.name}</h3>
                      </div>
                      <DropDownMenuSchedule
                        idClass={schedule.id}
                        defaultname={schedule.name}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="fixed bottom-4 right-4">
            <AddButtonSchedule />
          </div>
        </div>
      </div>
    );
  }

  // Fallback jika respons tidak sesuai ekspektasi (jarang terjadi jika backend konsisten)
  return <div>Tidak dapat menampilkan data. Format respons tidak dikenal.</div>;
}
