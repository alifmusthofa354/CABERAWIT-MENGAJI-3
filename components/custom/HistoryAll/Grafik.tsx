"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  // Legend,
} from "recharts";

import { useEffect, useState } from "react";

// Define the type for your raw attendance data (can be in a separate types.ts file)
interface Attendance {
  id: string;
  status: "Hadir" | "Ijin" | "Alfa";
  id_sudent: string;
  name: string;
}

// Define the type for the processed data that Recharts expects
interface ChartDataEntry {
  name: string;
  value: number;
}

// Function to fetch raw data (this typically runs on the server in Next.js App Router)
async function getData(): Promise<Attendance[]> {
  // Simulate fetching data from your API here.
  // In a real application, you'd replace this with an actual API call (e.g., fetch('/api/attendance')).
  return [
    { id: "728ed52f", status: "Hadir", id_sudent: "1", name: "alif musthofa" },
    { id: "728ed52s", status: "Hadir", id_sudent: "4", name: "alif" },
    { id: "728ed52q", status: "Hadir", id_sudent: "21", name: "alis" },
    { id: "728ed52d", status: "Hadir", id_sudent: "24", name: "alig" },
    { id: "828ed52f", status: "Ijin", id_sudent: "2", name: "fauzan minmah" },
    { id: "828ed52a", status: "Ijin", id_sudent: "0", name: "Uzumaki Naruto" },
    { id: "a28ed52f", status: "Alfa", id_sudent: "4", name: "budi budarsono" },
    { id: "a28ed529", status: "Alfa", id_sudent: "5", name: "dewansyah" },
    { id: "a28ed528", status: "Alfa", id_sudent: "6", name: "danang" },
    { id: "a28ed521", status: "Hadir", id_sudent: "12", name: "schrono" },
    { id: "a28ed522", status: "Alfa", id_sudent: "3", name: "wahyu" },
    { id: "a28ed523", status: "Ijin", id_sudent: "11", name: "taha" },
    { id: "a28ed524", status: "Alfa", id_sudent: "12", name: "zalfa" },
    { id: "b1c2d3e4", status: "Hadir", id_sudent: "7", name: "siti hartinah" },
    { id: "f5g6h7i8", status: "Hadir", id_sudent: "8", name: "agus kurniawan" },
    { id: "j9k0l1m2", status: "Hadir", id_sudent: "9", name: "bunga lestari" },
    { id: "n3o4p5q6", status: "Hadir", id_sudent: "10", name: "candra dewi" },
  ];
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

// const data = [
//   { name: "Hadir", value: 5 },
//   { name: "Ijin", value: 1 },
//   { name: "Alfa", value: 1 },
// ];

const COLORS = ["#00C49F", "#958888", "#ff4242"];

// Hook: detect screen width
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => setIsMobile(window.innerWidth < breakpoint);
    updateSize(); // initial
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [breakpoint]);

  return isMobile;
}

export default function Grafik() {
  const isMobile = useIsMobile();
  const [data, setData] = useState<Attendance[]>([]);

  // Menggunakan useEffect untuk memanggil getData saat komponen dimuat
  useEffect(() => {
    async function fetchData() {
      const fetchedData = await getData();
      setData(fetchedData);
    }
    fetchData();
  }, []);

  const processedData = processAttendanceData(data);

  const getValue = (name: string) =>
    processedData.find((item) => item.name === name)?.value || 0;
  return (
    <div className="w-full min-h-[400px] -mt-20 md:-mt-10">
      {/* <h1 className="text-2xl font-bold mb-4 text-center">Grafik Absensi</h1> */}
      <ResponsiveContainer className={"w-full min-h-[400px]"}>
        <PieChart className={"w-full h-full"}>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={
              isMobile
                ? ({ percent }) => `${(percent * 100).toFixed(0)}%`
                : ({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={isMobile ? 70 : 120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Kontainer baru untuk legend dan total */}
      <div className="flex flex-col items-center justify-center -mt-22 md:-mt-10">
        {" "}
        {/* Tambahkan flex-col, items-center, justify-center */}
        {/* Kontainer untuk Hadir, Ijin, Alfa agar bisa di tengah */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
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
    </div>
  );
}
