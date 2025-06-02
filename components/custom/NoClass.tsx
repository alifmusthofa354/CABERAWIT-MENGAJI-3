import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import AddClass from "@/components/custom/AddClass";

export default function NoClass() {
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
      <div className="flex flex-1 justify-center items-center flex-col gap-3">
        <p className="text-gray-600 text-center">
          Tidak ada kelas yang ditemukan. Silakan Buat kelas terlebih dahulu.
        </p>
        <AddClass mobile={true} />
      </div>
    </div>
  );
}
