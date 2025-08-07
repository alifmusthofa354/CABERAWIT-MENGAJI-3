import LegendAbsensi from "@/components/custom/absense/LegendAbsensi";

type AbsensiDetails = {
  id: string;
  name: string;
  status: 0 | 1 | 2;
  id_student: string;
};

interface Attendance {
  id: string;
  status: "Hadir" | "Ijin" | "Alfa";
  name: string;
}

// Fungsi untuk memetakan nilai status dari number ke string
function mapStatusToAttendanceString(
  status: AbsensiDetails["status"]
): Attendance["status"] {
  switch (status) {
    case 1:
      return "Hadir";
    case 2:
      return "Ijin";
    case 0:
      return "Alfa";
    default:
      // Penanganan jika status tidak dikenal, bisa throw error atau return default
      return "Alfa"; // Contoh: default ke "Alfa"
  }
}

// Fungsi untuk mentransformasi array AbsensiDetails[] menjadi Attendance[]
function transformAbsensiDetailsToAttendance(
  absensiDetailsArray: AbsensiDetails[]
): Attendance[] {
  return absensiDetailsArray.map((detail) => ({
    id: detail.id,
    name: detail.name,
    status: mapStatusToAttendanceString(detail.status),
    // id_student tidak perlu karena tidak ada di interface Attendance
  }));
}

export default function DisplayLegend({
  AbsensiDetails,
}: {
  AbsensiDetails: AbsensiDetails[];
}) {
  const transformedAttendanceData: Attendance[] =
    transformAbsensiDetailsToAttendance(AbsensiDetails);
  return (
    <>
      <LegendAbsensi record={transformedAttendanceData} />
    </>
  );
}
