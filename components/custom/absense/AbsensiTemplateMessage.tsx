"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useStore from "@/stores/useStoreClass";
import { useEffect } from "react";
import { fechingTemplate } from "@/actions/TemplateClassAction";

import { FaFileAlt, FaRedo } from "react-icons/fa"; // Menggunakan FaFileAlt untuk Template Message
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useState } from "react"; // Pastikan useState diimpor
import SaveDialog from "@/components/custom/templateClass/SaveDialog";
import PreviewTemplate from "@/components/custom/templateClass/PreviewTemplate";
import { useRouter } from "next/navigation";
import { SheetDictionary } from "../templateClass/SheetDictionary";

// --- Definisi Tipe ---
type TemplateType = {
  id: string;
  content: string;
};

// Interface yang mencerminkan SEMUA kemungkinan respons dari backend
type ApiResponeType = {
  message?: string; // Hanya ada jika skenario "belum ada kelas"
  action?: string; // Hanya ada jika skenario "belum ada kelas"
  data?: null; // Hanya ada jika skenario "belum ada kelas"
  template?: TemplateType[]; // Ada jika skenario "ada kelas" (bisa kosong atau berisi)
  idUserClassCurrent?: string;
  error?: string; // Untuk error dari backend
};

export default function AbsensiTemplateMessage() {
  const router = useRouter(); // Inisialisasi hook useRouter
  const queryClient = useQueryClient();
  const { selectedClassName, updateSelectedClassName } = useStore();
  const [draftValue, setDraftValue] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery<ApiResponeType, Error>({
    queryKey: ["template", selectedClassName],
    queryFn: () => fechingTemplate(selectedClassName as string),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (apiResponse && apiResponse.idUserClassCurrent) {
      if (apiResponse.idUserClassCurrent !== selectedClassName) {
        queryClient.setQueryData(
          ["template", apiResponse.idUserClassCurrent],
          apiResponse
        );
        updateSelectedClassName(apiResponse.idUserClassCurrent);
      }
    }
    if (
      apiResponse &&
      apiResponse.template &&
      apiResponse.template.length > 0
    ) {
      const value = apiResponse.template[0].content;
      setDraftValue(value);
    }
  }, [selectedClassName, apiResponse, queryClient, updateSelectedClassName]);

  // Fungsi untuk menangani perubahan pada Textarea secara real-time saat mengetik
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setDraftValue(value);
  };

  const handleRetry = () => {
    refetch(); // Panggil refetch untuk memicu permintaan ulang
  };

  const handleLinkClick = () => {
    router.push("/dashboard/kelas/template");
  };

  if (isLoading) {
    return (
      <>
        <div className="text-center text-white mt-4 p-4 bg-gray-700 rounded-md border-2 border-gray-600">
          <p>Sedang Memuat Template...</p>
        </div>
      </>
    );
  }
  if (isError) {
    return (
      <>
        <div className="text-center text-black mt-4 p-4 bg-red-200 rounded-md border-2 border-red-300">
          <p>Maaf Terjadi kesalahan. Silahkan Coba lagi.</p>
          <Button variant="destructive" onClick={handleRetry} className="mt-2">
            Coba Lagi
          </Button>
        </div>
      </>
    );
  }

  // --- Penanganan Skenario di Frontend ---

  // 1. Skenario: Belum ada kelas yang dibuat
  if (
    apiResponse &&
    apiResponse.message &&
    apiResponse.action === "create_class"
  ) {
    return;
  }

  // 2. Skenario: Ada kelas, namun belum ada template
  //    (apiResponse.template ada, tapi array-nya kosong)
  if (
    apiResponse &&
    apiResponse.template &&
    apiResponse.template.length === 0
  ) {
    return (
      <>
        <div className="text-center text-white mt-4 p-4 bg-gray-700 rounded-md border-2 border-gray-600">
          <p>Maaf terjadi kesalahan sehingga template tidak dapat ditemukan.</p>
          <Button variant={"link"} onClick={handleLinkClick} className="mt-2">
            Template Page
          </Button>
        </div>
      </>
    );
  }

  // 3. Skenario: Ada kelas dan ada template
  //    (apiResponse.template ada dan berisi data)
  if (apiResponse && apiResponse.template && apiResponse.template.length > 0) {
    return (
      <>
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
            <Tabs defaultValue="preview" className="w-full h-full">
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
                  To display a list of Absensi, type: [ABSENSI_LIST]
                </p>

                <SheetDictionary />
                <Button
                  type="submit"
                  className="w-full mt-2 md:mt-4"
                  onClick={() => setIsSaveDialogOpen(true)}
                >
                  Save Template
                </Button>
              </TabsContent>
              <TabsContent value="preview" className="flex flex-col">
                <PreviewTemplate value={draftValue} canSendWa={true} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <SaveDialog
          open={isSaveDialogOpen}
          onOpenChange={() => setIsSaveDialogOpen(false)}
          content={draftValue}
        />
      </>
    );
  }

  // Fallback jika respons tidak sesuai ekspektasi (jarang terjadi jika backend konsisten)
  return <div>Tidak dapat menampilkan data. Format respons tidak dikenal.</div>;
}
