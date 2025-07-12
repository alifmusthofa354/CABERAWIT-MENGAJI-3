import {
  FaUserCheck,
  FaCalendarAlt,
  FaChalkboardTeacher,
} from "react-icons/fa"; // Icon untuk tanggal/waktu

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
      <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-lg shadow-xl overflow-hidden mb-3 p-6 relative">
        <div className="absolute inset-0 opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <FaUserCheck className="text-3xl md:text-4xl mr-3 text-white" />
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-sm text-white">
              Rekap Absensi
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-base md:text-lg">
            <div className="flex items-center p-3 bg-white/10 rounded-lg shadow-sm">
              <FaChalkboardTeacher className="text-blue-200 text-xl flex-shrink-0 mr-3" />
              <span className="font-medium text-white overflow-hidden truncate">
                {AttendanceDetails.name}
              </span>
            </div>
            <div className="flex items-center p-3 bg-white/10 rounded-lg shadow-sm">
              <FaUserCheck className="text-green-200 text-xl flex-shrink-0 mr-3" />
              <span
                className="font-medium text-white overflow-hidden truncate"
                title={AttendanceDetails.email}
              >
                {AttendanceDetails.email}
              </span>
            </div>
            <div className="flex items-center p-3 bg-white/10 rounded-lg shadow-sm">
              <FaCalendarAlt className="text-purple-200 text-xl flex-shrink-0 mr-3" />
              <span className="font-medium text-white overflow-hidden truncate">
                {formatFriendlyDate(AttendanceDetails.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
