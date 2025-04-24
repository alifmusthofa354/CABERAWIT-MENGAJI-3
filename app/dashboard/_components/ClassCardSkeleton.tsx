import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton dari Shadcn UI

export default function ClassCardSkeleton() {
  return (
    <div className="rounded-lg shadow-md overflow-hidden bg-amber-50">
      <div className="relative">
        {/* Skeleton untuk gambar kelas */}
        <Skeleton className="w-full h-32" />

        {/* Skeleton untuk Label "Members" */}
        <div className="absolute top-2 left-2 bg-white text-green-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
          <Skeleton className="w-12 h-4" /> {/* Skeleton untuk teks */}
        </div>

        {/* Skeleton untuk ellipsis icon */}
        <div className="absolute top-2 right-2 text-white">
          <Skeleton className="w-6 h-6 rounded-full" />{" "}
          {/* Skeleton untuk icon ellipsis */}
        </div>
      </div>

      <div className="p-4">
        {/* Skeleton untuk judul kelas */}
        <Skeleton className="w-2/3 h-6 mb-2" />

        <div className="flex justify-between items-center text-sm text-gray-700">
          {/* Skeleton untuk deskripsi kelas */}
          <span className="flex items-center max-w-2/3 truncate whitespace-nowrap flex-grow">
            <Skeleton className="w-4 h-4 mr-2" /> {/* Skeleton untuk icon */}
            <Skeleton className="w-1/2 h-4" /> {/* Skeleton untuk deskripsi */}
          </span>

          <span className="flex items-center whitespace-nowrap min-w-min">
            <Skeleton className="w-4 h-4 mr-2" /> {/* Skeleton untuk icon */}
            <Skeleton className="w-1/2 h-4" />{" "}
            {/* Skeleton untuk jumlah murid */}
          </span>
        </div>
      </div>
    </div>
  );
}
