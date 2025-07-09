"use client"; // WAJIB: menandakan ini adalah Client Component

import { formatCurrentDate } from "@/util/dateFormatter";
import { useState, useEffect } from "react";

export default function ClientDate() {
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    // Set tanggal awal
    setCurrentDate(formatCurrentDate());

    // Opsional: memperbarui setiap detik jika Anda ingin jam juga
    const intervalId = setInterval(() => {
      setCurrentDate(formatCurrentDate());
    }, 1000);

    // Membersihkan interval saat komponen dilepas
    return () => clearInterval(intervalId);
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  return (
    <>
      <p className=" text-base md:text-xl">{currentDate}</p>
    </>
  );
}
