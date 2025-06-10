import HeaderDashboard from "@/components/ui/HeaderDashboard";
import ArchieveClass from "@/components/custom/ArchieveClass";

export default function Page() {
  return (
    <>
      <div className="min-h-svh bg-gray-50 @container flex flex-col">
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
          </div>
        </div>
        <div className=" p-4 md:p-6 mt-1 min-w-full flex-1">
          <ArchieveClass />
        </div>
      </div>
    </>
  );
}
