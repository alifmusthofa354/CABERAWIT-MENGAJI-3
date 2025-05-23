import DropDownMenu from "@/components/custom/generalClass/DropDownMenu";
import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import Image from "next/image";
import {
  FaCheckCircle,
  FaCircle,
  FaWhatsapp,
  FaBookOpen,
} from "react-icons/fa";

export default function Page() {
  const isActive = true; // Contoh status aktif, bisa diganti dengan data dinamis
  const idClass = 3;
  return (
    <div className="min-h-svh bg-gray-50 @container">
      <div className="bg-white shadow-md p-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="pr-3">
            <SelectClass />
          </div>
        </div>
      </div>
      <div className=" mx-auto p-4 md:p-6 mt-1 min-h-max">
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max">
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
                <div className="bg-gray-500 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full flex items-center">
                  <FaCircle className="mr-1" />
                  Tidak Aktif
                </div>
              )}
            </div>
            <div className="absolute top-2 right-2 md:top-4 md:right-4 text-white">
              <DropDownMenu idClass={idClass} isActive={isActive} />
            </div>
          </div>
          <div className="p-4">
            {/* Nama Kelas yang Lebih Menarik */}
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Kelas 5
              </h1>
            </div>

            {/* Deskripsi dengan Card Style */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
              <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                Kelas ini untuk PAUD 5 yang agak panjang jika mau dibahas disini
                makanya harus dibuat secara terpisah. Kelas ini untuk PAUD 5
                yang memiliki jumlah murid yang sangat banyak sehingga
                membutuhkan perhatian lebih dari guru.
              </p>
            </div>

            {/* Tombol WA Grup yang Lebih Menarik */}
            <div className="mt-4">
              <a
                href="https://chat.whatsapp.com/LBiP72yW4yaCsKVbjT5AVN?text=Halo%20saya%20ingin%20bergabung%20dengan%20grup%20kelas%205%20PAUD%20Ceria%20ini%20adalah%20pesan%20yang%20sangat%20panjang%20untuk%20menguji%20wrapping%20pada%20link"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Grup WhatsApp
              </a>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
