"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar"; // Pastikan sudah di-import dari shadcn
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Pastikan sudah di-import dari shadcn
import { Button } from "@/components/ui/button"; // Pastikan sudah di-import dari shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"; // Ikon kalender

// Contoh tipe data untuk konten historis
type HistoryDayContent = {
  id: string;
  title: string;
  date: string;
};

// Data contoh (simulasi)
const dummyData: HistoryDayContent[] = [
  { id: "1", title: "The Fall of the Berlin Wall", date: "2025-08-09" },
  {
    id: "2",
    title: "Signing of the Declaration of Independence",
    date: "2025-08-09",
  },
  { id: "3", title: "First Moon Landing", date: "1969-07-20" },
  { id: "4", title: "End of World War II", date: "1945-09-02" },
  { id: "5", title: "First computer was created", date: "1943-12-01" },
];

// Fungsi untuk mengambil data berdasarkan tanggal
const fetchContentByDate = async (
  date: Date | undefined
): Promise<HistoryDayContent[]> => {
  if (!date) {
    return []; // Jika tanggal tidak dipilih, kembalikan array kosong
  }
  const formattedDate = format(date, "yyyy-MM-dd");
  // Simulasi pengambilan data dari API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter data dummy berdasarkan tanggal yang diformat
      const filteredData = dummyData.filter(
        (item) => item.date === formattedDate
      );
      resolve(filteredData);
    }, 500); // Simulasi delay
  });
};

export default function HistoryDayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );
  const [content, setContent] = useState<HistoryDayContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);

  useEffect(() => {
    if (searchParams.get("date")) {
      handleFilter();
    }
  }, [searchParams]);

  const handleFilter = async () => {
    setIsLoading(true);
    setHasFiltered(true);
    const newContent = await fetchContentByDate(date);
    setContent(newContent);
    setIsLoading(false);

    // Update URL dengan parameter tanggal baru
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"));
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilter = () => {
    setDate(undefined);
    setContent([]);
    setHasFiltered(false);
    router.push("/history-day");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl space-y-4">
        {/* Card untuk Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              History Day
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full md:w-[280px] justify-start text-left font-normal ${
                    !date && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleFilter}
              disabled={!date}
              className="w-full md:w-auto"
            >
              Filter
            </Button>
            {hasFiltered && (
              <Button
                onClick={clearFilter}
                variant="outline"
                className="w-full md:w-auto"
              >
                Clear Filter
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Card untuk Konten */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading...</p>
              </div>
            ) : !hasFiltered ? (
              <div className="text-center py-8 text-gray-500">
                <p>Pilih tanggal terlebih dahulu untuk melihat konten.</p>
              </div>
            ) : content.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada konten yang ditemukan untuk tanggal ini.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/history-day/${item.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/history-day/${item.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          &rarr;
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
