import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { FaCalendarAlt } from "react-icons/fa";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-svh bg-gray-50 @container flex flex-col">
      {" "}
      {/* Tambahkan flex flex-col di sini */}
      <div className="bg-white shadow-md p-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="pr-3">
            <SelectClass />
          </div>
        </div>
      </div>
      {/* Container utama konten yang akan flex-1 */}
      <div className="p-4 md:p-6 mt-1 flex-1 flex flex-col">
        {" "}
        {/* Tambahkan flex-1 dan flex flex-col */}
        {/* Card utama yang menampung Template Message */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden mb-3 flex-1 flex flex-col">
          {" "}
          {/* Tambahkan flex-1 dan flex flex-col */}
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaCalendarAlt className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Template Message
              </h1>
            </div>
          </div>
          {/* Div untuk Textarea dan elemen di bawahnya, ini akan flex-1 juga untuk mendorong Button ke bawah */}
          <div className="px-4 pb-4 flex-1 flex flex-col">
            {" "}
            {/* px-4 pb-4 untuk padding, flex-1 dan flex flex-col */}
            <div className="grid w-full gap-1.5 flex-1">
              {" "}
              {/* Tambahkan flex-1 di sini */}
              <Textarea
                placeholder="Type your Template here."
                id="message-2"
                className="w-full flex-1 resize-none" // <-- w-full, flex-1, dan resize-none
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3 mb-6">
              {/* Tambah mt-2 untuk jarak */}
              Your Template will be copied to the support team.s
            </p>
            <Button className="w-full mt-4">Save</Button>{" "}
            {/* Tambah mt-4 untuk jarak */}
          </div>
        </div>
      </div>
    </div>
  );
}
