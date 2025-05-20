import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import Image from "next/image";
import { FaEllipsisV, FaCheckCircle, FaCircle } from "react-icons/fa";

export default function Page() {
  const isActive = true; // Contoh status aktif, bisa diganti dengan data dinamis

  return (
    <div className="min-h-svh bg-gray-50 @container">
      <div className="bg-white shadow-md p-3">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="pr-3">
            <SelectClass />
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 md:p-6 mt-1">
        <div className="bg-white rounded-md shadow-lg overflow-hidden">
          <div className="relative">
            <Image
              alt={`cover image`}
              src={
                "https://nybxzkiebrcyzvunjmig.supabase.co/storage/v1/object/public/cover-class-caberawit//coverclass-default.webp"
              }
              className="w-full h-32 md:h-48 object-cover"
              width={768} // Sesuaikan lebar
              height={200} // Sesuaikan tinggi
              priority // Tambahkan priority jika ini adalah gambar utama di above-the-fold
            />
            <div className="absolute top-2 left-2 md:top-4 md:left-4">
              {isActive ? (
                <div className="bg-green-500 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCheckCircle className="mr-1" />
                  Aktif
                </div>
              ) : (
                <div className="bg-red-500 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCircle className="mr-1" />
                  Tidak Aktif
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2 md:top-4 md:right-4 text-white">
              <FaEllipsisV />
            </div>
          </div>
          <div className="p-4">
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">
              Kelas 5
            </h1>
            <h6 className="text-sm md:text-base text-gray-600 mt-1">
              Deskripsi:{" "}
              <span className="text-gray-700 whitespace-normal">
                Kelas ini untuk PAUD 5 yang agak panjang jika mau dibahas disini
                makanya harus dibuat secara terpisah. Kelas ini untuk PAUD 5
                yang memiliki jumlah murid yang sangat banyak sehingga
                membutuhkan perhatian lebih dari guru
              </span>
            </h6>
            <h6 className="text-sm md:text-base text-gray-600 mt-1">
              WA Grup:{" "}
              <a
                href="https://chat.whatsapp.com/LBiP72yW4yaCsKVbjT5AVN?text=Halo%20saya%20ingin%20bergabung%20dengan%20grup%20kelas%205%20PAUD%20Ceria%20ini%20adalah%20pesan%20yang%20sangat%20panjang%20untuk%20menguji%20wrapping%20pada%20link"
                className="text-blue-500 hover:underline whitespace-normal break-words"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://chat.whatsapp.com/LBiP72yW4yaCsKVbjT5AVN?text=Halo%20saya%20ingin%20bergabung%20dengan%20grup%20kelas%205%20PAUD%20Ceria%20ini%20adalah%20pesan%20yang%20sangat%20panjang%20untuk%20menguji%20wrapping%20pada%20link
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
