"use client";
// Define the type for your raw attendance data (can be in a separate types.ts file)
interface Attendance {
  id: string;
  status: "Hadir" | "Ijin" | "Alfa";
  name: string;
}

// Define the type for the processed data that Recharts expects
interface ChartDataEntry {
  name: string;
  value: number;
}

// Function to process raw attendance data into chart-friendly format
function processAttendanceData(
  attendanceRecords: Attendance[]
): ChartDataEntry[] {
  const statusCounts: { [key: string]: number } = {};

  attendanceRecords.forEach((record) => {
    statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
  });

  const orderedStatuses = ["Hadir", "Ijin", "Alfa"]; // Define preferred order
  const finalChartData: ChartDataEntry[] = orderedStatuses.map((status) => ({
    name: status,
    value: statusCounts[status] || 0, // Use 0 if status is not present
  }));

  return finalChartData;
}

const COLORS = ["#00C49F", "#958888", "#ff4242"];

export default function LegendAbsensi({ record }: { record: Attendance[] }) {
  const processedData = processAttendanceData(record);

  const getValue = (name: string) =>
    processedData.find((item) => item.name === name)?.value || 0;
  return (
    <>
      <div className="flex flex-col items-center justify-center mt-2">
        {" "}
        {/* Tambahkan flex-col, items-center, justify-center */}
        {/* Kontainer untuk Hadir, Ijin, Alfa agar bisa di tengah */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {" "}
          {/* Menggunakan flex-wrap untuk responsivitas */}
          <p className="flex items-center text-sm" style={{ color: COLORS[0] }}>
            <span
              className={`w-3 h-3 rounded-full mr-2`}
              style={{ backgroundColor: COLORS[0] }}
            ></span>
            Hadir: {getValue("Hadir")}
          </p>
          <p className="flex items-center text-sm" style={{ color: COLORS[1] }}>
            <span
              className={`w-3 h-3 rounded-full mr-2`}
              style={{ backgroundColor: COLORS[1] }}
            ></span>
            Ijin: {getValue("Ijin")}
          </p>
          <p className="flex items-center text-sm" style={{ color: COLORS[2] }}>
            <span
              className={`w-3 h-3 rounded-full mr-2`}
              style={{ backgroundColor: COLORS[2] }}
            ></span>
            Alfa: {getValue("Alfa")}
          </p>
        </div>
        {/* Total Jumlah */}
        <p className="text-center font-bold text-lg text-[#5e42ff]">
          Jumlah: {processedData.reduce((total, item) => total + item.value, 0)}
        </p>
      </div>
    </>
  );
}
