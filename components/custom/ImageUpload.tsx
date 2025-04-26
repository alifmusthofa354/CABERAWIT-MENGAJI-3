"use client";
import { Label } from "@/components/ui/label";
import imageCompression from "browser-image-compression";

import React, { useState, ChangeEvent } from "react";

interface ImageUploadProps {
  onImageSelected: (file: File | null) => void;
  maxFileSizeMB?: number;
  allowedMimeTypes?: string[];
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  maxFileSizeMB = 0.5, // Ukuran maksimum default 0.5 MB (512 KB)
  allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"],
  maxWidth,
  maxHeight,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      onImageSelected(null);
      setError(null);
      return;
    }

    setError(null);

    // Validasi Jenis File
    if (!allowedMimeTypes.includes(file.type)) {
      setError(
        `Tipe file tidak didukung. Hanya ${allowedMimeTypes.join(
          ", "
        )} yang diperbolehkan.`
      );
      onImageSelected(null);
      return;
    }

    // Validasi Ukuran File Awal (opsional, bisa dihapus jika hanya ingin resize)
    const initialMaxSizeInBytes = (maxFileSizeMB || 2) * 1024 * 1024;
    const initialMaxSizeInKB = Math.round((maxFileSizeMB || 2) * 1024);
    if (file.size > initialMaxSizeInBytes) {
      setError(
        `Ukuran file terlalu besar (sebelum kompresi). Maksimum ${initialMaxSizeInKB}KB.`
      );
      onImageSelected(null);
      return;
    }

    // // Validasi Dimensi Gambar (Opsional)
    // if (maxWidth || maxHeight) {
    //   try {
    //     const imageUrl = URL.createObjectURL(file);
    //     const image = new Image();

    //     image.onload = () => {
    //       URL.revokeObjectURL(imageUrl); // Clean up memory

    //       if (maxWidth && image.width > maxWidth) {
    //         setError(`Lebar gambar melebihi batas maksimum (${maxWidth}px).`);
    //         onImageSelected(null);
    //         return;
    //       }

    //       if (maxHeight && image.height > maxHeight) {
    //         setError(`Tinggi gambar melebihi batas maksimum (${maxHeight}px).`);
    //         onImageSelected(null);
    //         return;
    //       }

    //       onImageSelected(file); // File valid, kirim ke parent component
    //     };

    //     image.onerror = () => {
    //       URL.revokeObjectURL(imageUrl);
    //       setError("Gagal membaca dimensi gambar.");
    //       onImageSelected(null);
    //     };

    //     image.src = imageUrl;
    //   } catch (error) {
    //     setError("Terjadi kesalahan saat memproses gambar.");
    //     onImageSelected(null);
    //     console.log(error);
    //   }
    // } else {
    //   onImageSelected(file); // File valid (ukuran dan tipe), kirim ke parent component
    // }

    // mengkompress dan mengubah ukuran gambar
    try {
      const targetMaxSizeMB = 200 / 1024; // Konversi 200 KB ke MB
      const options = {
        maxSizeMB: targetMaxSizeMB, // Target ukuran setelah kompresi (kurang dari 0.195 MB)
        maxWidthOrHeight: maxWidth || maxHeight || 500, // Resize berdasarkan lebar atau tinggi maksimum namun karena di props tidak ada maka yang diambil 500px
        useWebWorker: true,
        fileType: "image/webp", // Convert to WebP format
        initialQuality: 0.1, // Kualitas WebP (0-1, opsional)
      };
      const compressedFile = await imageCompression(file, options);
      console.log(
        "Ukuran file setelah kompresi:",
        compressedFile.size / 1024,
        "KB"
      );

      // Validasi Ukuran File Setelah Kompresi (harus kurang dari 200 KB)
      if (compressedFile.size > 200 * 1024) {
        setError(
          `Ukuran file setelah kompresi masih terlalu besar. Maksimum 200KB.`
        );
        onImageSelected(null);
        return;
      }

      onImageSelected(compressedFile); // Kirim file yang telah di-resize dan dikompresi
    } catch (error) {
      console.error("Gagal me-resize atau mengkompres gambar:", error);
      setError("Gagal me-resize atau mengkompres gambar.");
      onImageSelected(null);
    }
  };

  return (
    <>
      <Label htmlFor="image">Image</Label>
      <div className="p-2 flex-col h-auto text-gray-600  col-span-3 border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex  w-full min-w-0 rounded-md border bg-transparent  text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex  file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
        <input
          type="file"
          accept={allowedMimeTypes.join(",")}
          onChange={handleFileChange}
        />
      </div>
      <span className="col-span-4">
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {!error && (
          <p className="mt-1 text-xs text-gray-500">
            {maxFileSizeMB &&
              `Maksimum ukuran: ${Math.round(maxFileSizeMB * 1024)}KB`}
            {/* {!maxFileSizeMB && `Maksimum ukuran: 2048KB`}
            {maxWidth && `, Lebar maks: ${maxWidth}px`}
            {maxHeight && `, Tinggi maks: ${maxHeight}px`} */}
          </p>
        )}
      </span>
    </>
  );
};

export default ImageUpload;
