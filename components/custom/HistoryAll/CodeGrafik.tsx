interface ChartDataEntry {
  name: string;
  value: number;
}
const COLORS = ["#00C49F", "#958888", "#ff4242"];
export default function CodeGrafik(processedData: ChartDataEntry[]) {
  const getValue = (name: string) =>
    processedData.find((item) => item.name === name)?.value || 0;
  return (
    <>
      <div>
        <p className="text-left text-[#00C49F]">Hadir: 5</p>
        <p className="text-left text-[#958888]">Ijin: 1</p>
        <p className="text-left flex items-center" style={{ color: COLORS[2] }}>
          <span
            className={`w-3 h-3 rounded-full mr-2`}
            style={{ backgroundColor: COLORS[2] }}
          ></span>
          Alfa: {getValue("Alfa")}
        </p>
      </div>
    </>
  );
}
