import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import AddButtonSchedule from "@/components/custom/scheduleClass/AddButtonSchedule";

export default function NoSchedule() {
  return (
    <>
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
            Tidak ada jadwal yang ditemukan. Silakan Buat jadwal terlebih
            dahulu.
          </p>
        </div>
        <div className="fixed bottom-4 right-4">
          <AddButtonSchedule />
        </div>
      </div>
    </>
  );
}
