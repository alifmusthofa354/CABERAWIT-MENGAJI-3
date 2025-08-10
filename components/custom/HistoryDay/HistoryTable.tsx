import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import DisplayLegend from "@/components/custom/absense/DisplayLegend";
import {
  FaUserCheck,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaFingerprint,
} from "react-icons/fa"; // Icon untuk tanggal/waktu

import { formatFriendlyDate, formatNumberDate } from "@/util/dateFormatter";

type AbsensiDetails = {
  id_student: string;
  name: string;
  status: 0 | 1 | 2; // 1: Hadir, 0: Alfa, 2: Ijin
};

// Fungsi untuk mendapatkan teks status, ikon, dan kelas warna
const getStatusDisplay = (statusCode: number) => {
  switch (statusCode) {
    case 1: // Hadir
      return {
        text: "Hadir",
        icon: <FaCheckCircle className="text-green-500 text-base" />, // Ikon lebih kecil
        color: "bg-green-100 text-green-700 ring-1 ring-inset ring-green-200", // Kelas badge baru
      };
    case 0: // Alfa
      return {
        text: "Alfa",
        icon: <FaBan className="text-red-500 text-base" />, // Ikon lebih kecil
        color: "bg-red-100 text-red-700 ring-1 ring-inset ring-red-200", // Kelas badge baru
      };
    case 2: // Ijin
      return {
        text: "Ijin",
        icon: <MdInfo className="text-gray-500 text-base" />, // Ubah warna ikon info ke kuning
        color: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200", // Kelas badge baru
      };
    default:
      return {
        text: "Tidak Dikenal",
        icon: null,
        color: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
      };
  }
};

type AttendanceDetailsType = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export default function HistoryTable({
  AbsensiDetails,
  AttendanceDetails,
}: {
  AbsensiDetails: AbsensiDetails[];
  AttendanceDetails: AttendanceDetailsType;
}) {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white   overflow-hidden p-6 relative">
          <div className="absolute inset-0 opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-row justify-between mb-4">
              <div className="flex items-center">
                <FaUserCheck className="text-3xl md:text-4xl mr-3 text-white" />
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight drop-shadow-sm text-white">
                  Detail Absensi
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-base md:text-lg">
              <div className="flex items-center p-3 bg-white/10 rounded-lg shadow-sm">
                <FaFingerprint className="text-blue-200 text-xl flex-shrink-0 mr-3" />
                <span className="font-medium text-white overflow-hidden truncate">
                  {AttendanceDetails.id}
                </span>
              </div>
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
                  {/* Format tanggal untuk layar <= 375px (default) */}
                  <span className="block sm:hidden">
                    {formatNumberDate(AttendanceDetails.created_at)}
                  </span>
                  {/* Format tanggal untuk layar > 375px */}
                  <span className="hidden sm:block">
                    {formatFriendlyDate(AttendanceDetails.created_at)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-6 md:p-8 bg-white">
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
            <Table className="@container min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold text-gray-700 px-6 py-3 text-left">
                    Nama
                  </TableHead>
                  <TableHead className="font-bold text-gray-700 text-right whitespace-nowrap  py-3">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AbsensiDetails.map((attedance) => {
                  const statusDisplay = getStatusDisplay(attedance.status);
                  return (
                    <TableRow
                      key={attedance.id_student}
                      className="group border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ease-in-out"
                    >
                      <TableCell className="max-w-[150px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4 text-gray-800">
                        {attedance.name}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap  py-4">
                        <span
                          className={`inline-flex items-center justify-end gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${statusDisplay.color}`}
                        >
                          {statusDisplay.icon}
                          <span>{statusDisplay.text}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DisplayLegend AbsensiDetails={AbsensiDetails} />
        </div>
      </div>
    </>
  );
}
