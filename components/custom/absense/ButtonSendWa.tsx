import { useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";

// Fungsi validasi format link WhatsApp
function isValidWhatsAppLink(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false;
  }
  // Pola untuk link chat personal (wa.me atau api.whatsapp.com/send?phone=)
  // Nomor telepon harus 10-15 digit
  const waMeRegex =
    /^https:\/\/(wa\.me\/|api\.whatsapp\.com\/send\?phone=)\d{10,15}$/;

  // Pola untuk link undangan grup (chat.whatsapp.com)
  // Menambahkan (?:\?.*)? untuk mengizinkan query parameter opsional di akhir
  const waChatRegex =
    /^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]{22}(?:\?.*)?$/; // <--- PERBAIKAN DI SINI

  console.log("WA LINK : ", url);
  console.log("WA ME : ", waMeRegex.test(url));
  console.log("WA CHAT : ", waChatRegex.test(url));
  return waMeRegex.test(url) || waChatRegex.test(url);
}

// Tipe untuk objek 'classroom' itu sendiri
type ClassroomDetailType = {
  name: string;
  status: number;
  image_url: string; // Atau string | null jika bisa kosong
  link_wa: string;
  description: string; // Atau string | null jika bisa kosong
};

type UserClassItemType = {
  id: string;
  isOwner: boolean;
  classroom: ClassroomDetailType;
};

type ButtonSendWaProps = {
  handleCopy?: () => void; // Prop onClick yang akan diterima
};
export default function ButtonSendWa({ handleCopy }: ButtonSendWaProps) {
  const { selectedClassName } = useStore(); // ID kelas yang dipilih
  const queryClient = useQueryClient();
  const [linkWA, setLinkWA] = useState<string>(""); // State untuk menyimpan link WA
  const [isLinkValid, setIsLinkValid] = useState<boolean>(false);

  useEffect(() => {
    // Mendapatkan data dari cache React Query
    const classrooms: UserClassItemType[] | undefined =
      queryClient.getQueryData([
        "classroom", // Pastikan ini adalah queryKey yang benar untuk data kelas Anda
      ]);

    // Lakukan pencarian hanya jika data ada dan selectedClassName tidak null/undefined
    if (classrooms && selectedClassName) {
      // Mencari item di dalam array 'classrooms' yang id-nya cocok dengan selectedClassName
      const foundClassroom = classrooms.find(
        (item) => item.id === selectedClassName
      );

      // Jika item ditemukan dan memiliki link_wa
      if (foundClassroom && foundClassroom.classroom.link_wa) {
        const url = foundClassroom.classroom.link_wa;
        setLinkWA(url);
        setIsLinkValid(isValidWhatsAppLink(url)); // Set validitas berdasarkan format
      } else {
        // Jika tidak ditemukan atau link_wa kosong
        setLinkWA(""); // Reset linkWA jika tidak ditemukan atau tidak valid
        setIsLinkValid(false);
        console.warn(
          "Classroom with selectedClassName not found or link_wa is missing:",
          selectedClassName
        );
      }
    } else {
      // Reset linkWA jika tidak ada data kelas atau selectedClassName belum ada
      setLinkWA("");
      setIsLinkValid(false);
      console.log(
        "No classroom data in cache or selectedClassName is not set."
      );
    }
  }, [queryClient, selectedClassName]); // Tambahkan selectedClassName sebagai dependensi

  return (
    <>
      {isLinkValid ? (
        <a
          href={linkWA}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:flex-1" // w-full di a tag sudah bagus
        >
          {/* Tombol di dalamnya juga harus w-full dari parent a tag-nya */}
          <Button variant={"default"} className="w-full" onClick={handleCopy}>
            <FaWhatsapp />
            <span>Send WA</span>
          </Button>
        </a>
      ) : (
        <Button variant={"destructive"} disabled className="w-full md:flex-1">
          <FaWhatsapp />
          <span>Link Invalid</span>
        </Button>
      )}
    </>
  );
}
