import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import Image from "next/image";
import { FaEllipsisV, FaCheckCircle, FaCircle } from "react-icons/fa";
export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-4">
          <SelectClass />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-3 bg-amber-100 ">
        <div className="relative ">
          <Image
            alt={`cover image`}
            src={
              "https://nybxzkiebrcyzvunjmig.supabase.co/storage/v1/object/public/cover-class-caberawit//coverclass-default.webp"
            }
            className="w-full h-32 md:min-h-48 object-cover"
            width={1500}
            height={1000}
          />

          <div className="absolute top-2 left-2 bg-white text-green-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            <FaCheckCircle className="mr-1" />
            Active
          </div>

          <div className="absolute top-2 left-2 bg-white text-gray-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            <FaCircle className="mr-1" />
            Not Active
          </div>

          <div className="absolute top-2 right-2 text-white">
            <FaEllipsisV />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Kelas 5</h1>
          <p className="text-gray-600">kelas ini kelas untuk paud 5</p>
        </div>
      </div>
    </>
  );
}
