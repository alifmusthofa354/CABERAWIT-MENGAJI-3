import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Button } from "../ui/button";
import { FiAlertCircle } from "react-icons/fi";

export default function ErrorClass({
  error,
  handleRetry,
}: {
  error: Error;
  handleRetry: () => void;
}) {
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
        <div className="flex flex-1 justify-center items-center">
          <div className="flex flex-col text-center justify-center items-center">
            <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-lg font-semibold text-red-700 mb-4">
              {error.message}
            </p>
            <div>
              <Button
                variant="destructive"
                className=" transition-all duration-300 transform hover:scale-105 active:scale-95 "
                onClick={handleRetry} // Tambahkan onClick di sini
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
