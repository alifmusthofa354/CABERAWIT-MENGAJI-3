import DataTableAbsense from "@/components/custom/absense/DataTableAbsense";
import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { FaUserCheck } from "react-icons/fa";

import { Input } from "@/components/ui/input"; // Import Input component
import { Label } from "@/components/ui/label"; // Import Label component

export default function Page() {
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
      <div className="p-4 md:p-6 mt-1 flex-1 flex flex-col">
        {/* Owner Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaUserCheck className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Absensi
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="tanggalKegiatan">Tanggal Kegiatan</Label>
                <Input
                  id="tanggalKegiatan"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]} // Set default to today's date
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="namaKegiatan">Nama Kegiatan</Label>
                <Input
                  id="namaKegiatan"
                  type="text"
                  placeholder="Contoh: Belajar Matematika"
                  className="mt-1"
                />
              </div>
            </div>
            <DataTableAbsense />
          </div>
        </div>
      </div>
    </div>
  );
}
