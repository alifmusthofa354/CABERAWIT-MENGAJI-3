"use client";

import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { FaFileAlt, FaRedo, FaEye } from "react-icons/fa"; // Menggunakan FaFileAlt untuk Template Message

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react"; // Pastikan useState diimpor

// Data siswa
const siswa: Array<{ id: number; name: string }> = [
  {
    id: 1,
    name: "Musa",
  },
  {
    id: 2,
    name: "fiya",
  },
  {
    id: 3,
    name: "anisa",
  },
  // Anda bisa menambahkan lebih banyak siswa di sini
  {
    id: 4,
    name: "Budi",
  },
  {
    id: 5,
    name: "Siti",
  },
];

// Fungsi pembantu untuk menghasilkan daftar siswa dalam format teks
const generateStudentListString = (
  students: Array<{ id: number; name: string }>
) => {
  if (!students || students.length === 0) {
    return "Tidak ada siswa terdaftar.";
  }
  return students
    .map((student, index) => `${index + 1}. ${student.name}`)
    .join("\n");
};

const STUDENT_LIST_PLACEHOLDER = "[STUDENT_LIST]";

export default function Page() {
  // State untuk nilai yang SEDANG DIKETIK di textarea
  const [draftValue, setDraftValue] = useState("");
  // State untuk nilai yang SUDAH DISIMPAN (akan berubah hanya saat Save ditekan)
  const [savedValue, setSavedValue] = useState("");

  // Fungsi untuk menangani perubahan pada Textarea secara real-time saat mengetik
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDraftValue(event.target.value);
  };

  // Fungsi untuk menangani aksi 'Save'
  const handleSave = () => {
    const studentList = generateStudentListString(siswa);
    // Ganti placeholder dalam draftValue dengan daftar siswa yang sebenarnya
    const finalMessage = draftValue.replace(
      STUDENT_LIST_PLACEHOLDER,
      studentList
    );
    setSavedValue(finalMessage); // Salin nilai dari draftValue ke savedValue
  };

  return (
    <div className="min-h-svh bg-gray-50 @container flex flex-col">
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
        {/* Card utama yang menampung Template Message */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden mb-3 flex-1 flex flex-col">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaFileAlt className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Template Message
              </h1>
            </div>
          </div>
          {/* Div untuk Textarea dan elemen di bawahnya, ini akan flex-1 juga untuk mendorong Button ke bawah */}
          <div className="px-4 pb-4 flex-1 flex flex-col">
            <div className="grid w-full gap-1.5 flex-1">
              <Textarea
                placeholder="Type your Template here."
                id="message-2"
                className="w-full flex-1 resize-none"
                value={draftValue} // <--- Textarea diikat ke 'draftValue'
                onChange={handleTextareaChange} // <--- Perubahan input memperbarui 'draftValue'
              />
            </div>
            <p className="text-sm text-muted-foreground mt-3 mb-6">
              To display a list of students, type: [STUDENT_LIST]
            </p>
            {/* Container untuk tombol Reset dan Preview */}
            <div className="flex flex-col md:flex-row gap-10 mt-4 px-20 justify-between">
              {" "}
              {/* flex-col di mobile, flex-row di md, dengan gap */}
              <Button variant="outline" className="w-1/4" onClick={handleSave}>
                <FaRedo className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button variant="outline" className="w-1/4" onClick={handleSave}>
                <FaEye className="mr-2 h-4 w-4" /> Preview
              </Button>
              <Button className="w-1/4" onClick={handleSave}>
                {" "}
                {/* Tombol Save juga di dalam flex ini */}
                Save Template
              </Button>
            </div>

            {/* Menampilkan nilai yang sudah disimpan */}
            <h2 className="text-lg font-semibold mt-6 mb-2">
              Saved Template Preview:
            </h2>
            <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-gray-800 border border-gray-300">
              {savedValue || "No template saved yet."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
