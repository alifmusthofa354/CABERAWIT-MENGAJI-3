"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Hadir", value: 5 },
  { name: "Ijin", value: 1 },
  { name: "Alfa", value: 1 },
];

const COLORS = ["#259c36", "#758577", "#bd2121"];

export default function Grafik() {
  return (
    <div className="w-full h-[400px] p-8">
      <h1 className="text-2xl font-bold mb-4">Grafik Absensi</h1>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={120}
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
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
