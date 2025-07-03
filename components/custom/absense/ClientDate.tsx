"use client"; // WAJIB: menandakan ini adalah Client Component

import { useState, useEffect } from "react";

export default function ClientDate() {
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    // Fungsi untuk memformat tanggal
    const formatCurrentDate = () => {
      const today = new Date();

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long", // Must be 'long', 'short', or 'narrow'
        year: "numeric", // Must be 'numeric' or '2-digit'
        month: "long", // Must be 'numeric', '2-digit', 'long', 'short', or 'narrow'
        day: "numeric", // Must be 'numeric' or '2-digit'
        hour: "2-digit", // Must be 'numeric' or '2-digit'
        minute: "2-digit", // Must be 'numeric' or '2-digit'
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      };

      const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(
        today
      );
      return `${formattedDate}`;
    };

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
