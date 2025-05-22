"use client";

import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { FaFileAlt, FaRedo } from "react-icons/fa"; // Menggunakan FaFileAlt untuk Template Message
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FaCopy } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react"; // Pastikan useState diimpor
import SaveDialog from "@/components/custom/templateClass/SaveDialog";

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
  const [savedValue, setSavedValue] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  // Fungsi untuk menangani perubahan pada Textarea secara real-time saat mengetik
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setDraftValue(value);
    const studentList = generateStudentListString(siswa);
    const finalMessage = value.replace(STUDENT_LIST_PLACEHOLDER, studentList);
    setSavedValue(finalMessage);
  };

  return (
    <>
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
              <Tabs defaultValue="account" className="w-full h-full">
                <TabsList>
                  <TabsTrigger value="template">Template</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="template" className="flex flex-col">
                  <div className="p-1.5 w-full  flex justify-end gap-2 -mt-2 md:-mt-4">
                    <Button
                      size={"custom_icon"}
                      variant={"outline"}
                      onClick={() => {
                        setDraftValue("");
                        setSavedValue("");
                      }}
                    >
                      <span className="sr-only">Reset</span>
                      <FaRedo />
                    </Button>
                  </div>
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
                </TabsContent>
                <TabsContent value="preview" className="flex flex-col">
                  <div className="p-1.5 w-full  flex justify-end gap-2 -mt-2 md:-mt-4">
                    <Button
                      size={"custom_icon"}
                      variant={"outline"}
                      onClick={() => {
                        navigator.clipboard.writeText(savedValue);
                        toast.success("Message has been copied to clipboard.");
                      }}
                    >
                      <span className="sr-only">Copy</span>
                      <FaCopy />
                    </Button>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap text-gray-800 border border-gray-300 h-full">
                    {savedValue || "No template saved yet."}
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                className="w-full mt-2 md:mt-4"
                onClick={() => setIsSaveDialogOpen(true)}
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SaveDialog
        open={isSaveDialogOpen}
        onOpenChange={() => setIsSaveDialogOpen(false)}
        idClass={3}
      />
    </>
  );
}
