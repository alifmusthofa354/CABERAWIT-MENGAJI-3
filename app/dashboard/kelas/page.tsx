import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import Image from "next/image";
import { FaEllipsisV, FaCheckCircle, FaCircle } from "react-icons/fa";

export default function Page() {
  const isActive = true; // Contoh status aktif, bisa diganti dengan data dinamis

  return (
    <div className="min-h-svh bg-gray-50">
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="p-2">
            <SelectClass />
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6 mt-4">
        <div className="bg-white rounded-md shadow-lg overflow-hidden">
          <div className="relative">
            <Image
              alt={`cover image`}
              src={
                "https://nybxzkiebrcyzvunjmig.supabase.co/storage/v1/object/public/cover-class-caberawit//coverclass-default.webp"
              }
              className="w-full h-48 object-cover"
              width={768} // Sesuaikan lebar
              height={200} // Sesuaikan tinggi
            />
            <div className="absolute top-4 left-4">
              {isActive ? (
                <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCheckCircle className="mr-1" />
                  Aktif
                </div>
              ) : (
                <div className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCircle className="mr-1" />
                  Tidak Aktif
                </div>
              )}
            </div>
            <div className="absolute top-4 right-4 text-white">
              <FaEllipsisV />
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-xl font-semibold text-gray-800">Kelas 5</h1>
            <h6 className="text-gray-600 mt-1">
              Deskripsi:{" "}
              <span className="text-gray-700">Kelas ini untuk PAUD 5</span>
            </h6>
            <h6 className="text-gray-600 mt-1">
              WA Grup:{" "}
              <a
                href="https://chat.whatsapp.com/LBiP72yW4yaCsKVbjT5AVN"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://chat.whatsapp.com/LBiP72yW4yaCsKVbjT5AVN
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
