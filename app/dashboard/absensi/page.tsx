"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fechingAttedance } from "@/actions/AbsensiAction";

//import DataTableAbsense from "@/components/custom/absense/DataTableAbsense";
import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { FaUserCheck } from "react-icons/fa";

import AddButtonAttedance from "@/components/custom/absense/AddButtonAttedance";
import NoClass from "@/components/custom/NoClass";
import LoadingClass from "@/components/custom/LoadingClass";
import ErrorClass from "@/components/custom/ErrorClass";

// --- Definisi Tipe ---

type AbsensiDetails = {
  id: string;
  name: string;
  status: number;
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
  const queryClient = useQueryClient();
  const { selectedClassName, updateSelectedClassName } = useStore();

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponeType, Error>({
    queryKey: ["attedance", selectedClassName],
    queryFn: () => fechingAttedance(selectedClassName as string),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (apiResponse && apiResponse.idUserClassCurrent) {
      if (apiResponse.idUserClassCurrent !== selectedClassName) {
        queryClient.setQueryData(
          ["attedance", apiResponse.idUserClassCurrent],
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
        <div className="min-h-svh bg-gray-50 @container flex flex-col">
          <div className="bg-white shadow-md p-3 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <HeaderDashboard />
              <div className="pr-3">
                <SelectClass />
              </div>
            </div>
          </div>
          <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col text-center justify-center items-center">
              <p className="text-gray-600 text-center text-2xl">
                Hari ini belum ada absensi
              </p>
              <div className="fixed bottom-4 right-4">
                <AddButtonAttedance />
              </div>
            </div>
          </div>
        </div>
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
    const formatFriendlyDate = (dateString: string | null) => {
      if (!dateString) return "Tanggal tidak tersedia"; // Handle kasus jika data belum ada

      const dateObject = new Date(dateString);

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long", // Must be 'long', 'short', or 'narrow'
        year: "numeric", // Must be 'numeric' or '2-digit'
        month: "long", // Must be 'numeric', '2-digit', 'long', 'short', or 'narrow'
        day: "numeric", // Must be 'numeric' or '2-digit'
        hour: "2-digit", // Must be 'numeric' or '2-digit'
        minute: "2-digit", // Must be 'numeric' or '2-digit'
        hour12: false,
        timeZone: "Asia/Jakarta",
      };

      const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
        dateObject
      );
      return `${formattedDate} WIB`;
    };

    return (
      <>
        <div className="min-h-svh bg-gray-50 @container">
          <div className="bg-white shadow-md p-3 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
              <HeaderDashboard />
              <div className="pr-3">
                <SelectClass />
              </div>
            </div>
          </div>
          <div className="p-4 md:p-6 mt-1 flex-1 flex flex-col">
            {/* Owner Section */}
            <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <FaUserCheck className="text-blue-600 text-2xl md:text-3xl mr-2" />
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                    Absensi
                  </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p>Kelas: {apiResponse.attedance.AttendanceDetails.name}</p>
                    <p>
                      Absenser: {apiResponse.attedance.AttendanceDetails.email}
                    </p>
                    <p>
                      {formatFriendlyDate(
                        apiResponse.attedance.AttendanceDetails.created_at
                      )}
                    </p>
                  </div>
                </div>
                {/* <DataTableAbsense /> */}
              </div>
            </div>
          </div>
          <div className="fixed bottom-4 right-4">
            <AddButtonAttedance />
          </div>
        </div>
      </>
    );
  }

  // Fallback jika respons tidak sesuai ekspektasi (jarang terjadi jika backend konsisten)
  return <div>Tidak dapat menampilkan data. Format respons tidak dikenal.</div>;
}
