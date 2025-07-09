import DropDownMenuSchedule from "@/components/custom/scheduleClass/DropDownMenuSchedule";
import { FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi"; // Icon untuk status absensi
type AbsensiDetails = {
  id: string;
  name: string;
  status: 0 | 1 | 2;
  id_student: string;
};

// Fungsi untuk mendapatkan teks status dan ikonnya
const getStatusDisplay = (statusCode: number) => {
  switch (statusCode) {
    case 1:
      return {
        text: "Hadir",
        icon: <FiCheckCircle className="text-green-500 text-lg" />,
        color: "text-green-600",
      };
    case 0:
      return {
        text: "Alfa",
        icon: <FiXCircle className="text-red-500 text-lg" />,
        color: "text-red-600",
      };
    case 2:
      return {
        text: "Ijin",
        icon: <FiAlertCircle className="text-yellow-500 text-lg" />,
        color: "text-yellow-600",
      };
    default:
      return { text: "Tidak Dikenal", icon: null, color: "text-gray-500" };
  }
};

export default function AbsensiDetails({
  AbsensiDetails,
}: {
  AbsensiDetails: AbsensiDetails[];
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        {AbsensiDetails.map((attedance) => {
          const statusDisplay = getStatusDisplay(attedance.status);
          return (
            <div
              key={attedance.id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between transition-all duration-200 hover:shadow-lg hover:border-blue-300 border border-transparent"
            >
              <div className="flex items-center">
                {/* Nama Siswa */}
                <h3 className="font-semibold text-lg text-gray-800 mr-4">
                  {attedance.name}
                </h3>
                {/* Status Absensi dengan Icon */}
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${statusDisplay.color}`}
                >
                  {statusDisplay.icon}
                  <span>{statusDisplay.text}</span>
                </div>
              </div>
              {/* DropDownMenuSchedule */}
              <DropDownMenuSchedule
                idClass={attedance.id} // Periksa apakah ini `idClass` atau `idStudent`
                defaultname={attedance.name}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
