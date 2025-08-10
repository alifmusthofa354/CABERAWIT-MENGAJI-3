"use client";
import { FaLink } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fechingHistoryDayDetail } from "@/actions/HistoryActions";

import HeaderDashboard from "@/components/ui/HeaderDashboard";

import NoClass from "@/components/custom/NoClass";
import LoadingClass from "@/components/custom/LoadingClass";
import ErrorClass from "@/components/custom/ErrorClass";
import EmptyAttedance from "@/components/custom/absense/EmptyAttedance";
import HistoryTable from "@/components/custom/HistoryDay/HistoryTable";
import { useParams } from "next/navigation";

// --- Definisi Tipe ---

type AbsensiDetails = {
  id: string;
  name: string;
  status: 0 | 1 | 2;
  id_student: string;
};

type AttendanceDetails = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type attedance = {
  AttendanceDetails: AttendanceDetails;
  AbsensiDetails: AbsensiDetails[];
};

// Interface yang mencerminkan SEMUA kemungkinan respons dari backend
type ApiResponeType = {
  message?: string; // Hanya ada jika skenario "belum ada kelas"
  action?: string; // Hanya ada jika skenario "belum ada kelas"
  data?: null; // Hanya ada jika skenario "belum ada kelas"
  attedance?: attedance; // Ada jika skenario "ada kelas" (bisa kosong atau berisi)
  idUserClassCurrent?: string;
  error?: string; // Untuk error dari backend
};

export default function Page() {
  const params = useParams();
  const idAttedance = params.id;

  const queryClient = useQueryClient();
  const { selectedClassName, updateSelectedClassName } = useStore();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponeType, Error>({
    queryKey: ["historyDayDetail", selectedClassName, idAttedance as string],
    queryFn: () =>
      fechingHistoryDayDetail(
        selectedClassName as string,
        idAttedance as string
      ),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (apiResponse && apiResponse.idUserClassCurrent) {
      if (apiResponse.idUserClassCurrent !== selectedClassName) {
        queryClient.setQueryData(
          ["historyDayDetail", apiResponse.idUserClassCurrent],
          apiResponse
        );
        updateSelectedClassName(apiResponse.idUserClassCurrent);
      }
    }
  }, [selectedClassName, apiResponse, queryClient, updateSelectedClassName]);

  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  if (isLoading) return <LoadingClass />;

  if (isError) return <ErrorClass error={error} handleRetry={handleRetry} />;

  // 1. Skenario: Belum ada kelas yang dibuat
  if (
    apiResponse &&
    apiResponse.message &&
    apiResponse.action === "create_class"
  ) {
    return <NoClass />;
  }

  // 2. Skenario: Ada kelas, namun belum ada absensi

  if (apiResponse && apiResponse.attedance === null) {
    return (
      <>
        <EmptyAttedance />
      </>
    );
  }

  // 3. Skenario: Ada kelas dan ada template
  //    (apiResponse.template ada dan berisi data)
  if (
    apiResponse &&
    apiResponse.attedance &&
    apiResponse.attedance.AttendanceDetails &&
    apiResponse.attedance.AbsensiDetails.length > 0
  ) {
    const AttendanceDetails = apiResponse.attedance.AttendanceDetails;

    return (
      <>
        <div className="min-h-svh bg-gray-50 @container">
          <div className="bg-white shadow-md p-3 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <HeaderDashboard />
              <div className="pr-1 text-xs block md:hidden">
                <div className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 text-gray-600">
                  <FaLink className="text-sm" />{" "}
                  {/* Menggunakan ikon FaTag dari react-icons/fa */}
                  <p className="font-semibold">{AttendanceDetails.id}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Konten Utama */}
          <div className="p-4 md:p-6 mt-1 flex-1 flex flex-col gap-4 bg-gray-100">
            <HistoryTable
              AbsensiDetails={apiResponse.attedance.AbsensiDetails}
              AttendanceDetails={AttendanceDetails}
            />
          </div>
        </div>
      </>
    );
  }

  // Fallback jika respons tidak sesuai ekspektasi (jarang terjadi jika backend konsisten)
  return <div>Tidak dapat menampilkan data. Format respons tidak dikenal.</div>;
}
