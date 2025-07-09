import { FaUserCheck, FaCalendarAlt } from "react-icons/fa"; // Icon untuk tanggal/waktu
import { formatFriendlyDate } from "@/util/dateFormatter";

type AttendanceDetailsType = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export default function AttedanceDetail({
  AttendanceDetails,
}: {
  AttendanceDetails: AttendanceDetailsType;
}) {
  return (
    <>
      {" "}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-xl overflow-hidden mb-3 p-6 relative">
        <div className="absolute inset-0 opacity-10"></div>
        {/* Pola background */}
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <FaUserCheck className="text-3xl md:text-4xl mr-3 text-blue-200" />
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-sm">
              Rekap Absensi
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-blue-100 text-lg">
            <p className="flex items-center">
              <span className="font-semibold w-24">Kelas:</span>
              <span className="ml-2">{AttendanceDetails.name}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold w-24">Absenser:</span>
              <span className="ml-2">{AttendanceDetails.email}</span>
            </p>
            <p className="flex items-center col-span-1 sm:col-span-2">
              <FaCalendarAlt className="inline-block mr-2 text-blue-300" />
              <span className="font-semibold">Tanggal:</span>
              <span className="ml-2">
                {formatFriendlyDate(AttendanceDetails.created_at)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
