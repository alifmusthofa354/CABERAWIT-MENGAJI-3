import Image from "next/image"; // Jika ingin menggunakan Next.js Image component
import NoDataIllustration from "@/public/absensikosong.webp"; // Ganti dengan path ilustrasi Anda

import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import AddButtonAttedance from "@/components/custom/absense/AddButtonAttedance";

export default function EmptyAttedance() {
  return (
    <>
      <div className="min-h-svh bg-gray-50 @container flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <SelectClass />
            </div>
          </div>
        </div>

        {/* Konten Utama - Pesan Kosong yang Lebih Menarik */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-48 h-48  mx-auto">
              {" "}
              {/* Ukuran ilustrasi */}
              {/* Ganti dengan ilustrasi atau ikon yang relevan */}
              <Image
                src={NoDataIllustration} // Pastikan path ini benar
                alt="No attendance data"
                width={192} // Lebar sesuai w-48 (192px)
                height={192} // Tinggi sesuai h-48 (192px)
                className="object-contain w-full h-full"
              />
            </div>
            {/* Pesan yang Lebih Ramah */}
            <p className="text-gray-700 text-lg sm:text-2xl md:text-3xl font-semibold leading-tight px-4">
              Belum ada absensi hari ini.
            </p>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-sm md:max-w-full mx-auto px-4">
              Tekan tombol + untuk merekam kehadiran siswa.
            </p>
          </div>
        </div>

        {/* Tombol Tambah - Tetap di Kanan Bawah */}
        <div className="fixed bottom-6 right-6 z-40">
          {" "}
          {/* Sedikit lebih jauh dari tepi */}
          <AddButtonAttedance />
        </div>
      </div>
    </>
  );
}
