import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { ClipLoader } from "react-spinners";

export default function LoadingClass() {
  return (
    <div className="min-h-svh bg-gray-50 @container flex flex-col">
      <div className="bg-white shadow-md p-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="pr-3">
            <SelectClass />
          </div>
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center">
        <div className="flex justify-center items-center gap-3">
          <ClipLoader
            color="gray" // Warna spinner (teal)
            size={50} // Ukuran spinner
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <span className="text-xl md:text-2xl font-semibold">
            Sedang Memuat Kelas
            <span>
              <span className="animate-ping delay-0">.</span>
              <span className="animate-ping delay-400">.</span>
              <span className="animate-ping delay-800">.</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
