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
  { name: "Ijin", value: 5 },
  { name: "Alfa", value: 5 },
];

const COLORS = ["#259c36", "#758577", "#bd2121"];

export default function Grafik() {
  return (
    <div className="w-full h-[400px] p-8">
      <h1 className="text-2xl font-bold mb-4">Grafik Absensi</h1>
      <ResponsiveContainer className={"w-full h-full"}>
        <PieChart className={"w-full h-full"}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            fill="#8884d8"
            outerRadius={90}
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
