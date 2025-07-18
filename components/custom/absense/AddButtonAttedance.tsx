"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddButtonAttedance() {
  const router = useRouter(); // Inisialisasi hook useRouter

  const handleButtonClick = () => {
    router.push("/dashboard/absensi/create");
  };
  return (
    <>
      <div>
        <Button
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-md"
          onClick={handleButtonClick}
        >
          <Plus className="w-8 h-8" />
        </Button>
      </div>
    </>
  );
}
