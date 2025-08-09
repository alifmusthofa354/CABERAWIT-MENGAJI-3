// Pastikan semua import ini sudah ada
"use client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Filter as FilterIcon,
  XCircle,
} from "lucide-react"; // Menambahkan ikon XCircle dan Filter

export default function HistoryDateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );

  const hasFiltered = !!date;

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (date) {
      params.set("date", date.toISOString());
    } else {
      params.delete("date");
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilter = () => {
    setDate(undefined);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("date");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center">
      <Card
        className="
        w-full 
        transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-2xl
      "
      >
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-extrabold leading-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            History Day
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-4 transition-all duration-300">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full md:w-[280px] justify-start text-left font-normal transition-all duration-300 shadow-lg ${
                  !date
                    ? "text-muted-foreground"
                    : "text-primary border-primary hover:bg-primary/5"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "PPP", { locale: id })
                ) : (
                  <span>Pilih Tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-lg shadow-xl">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={id}
                initialFocus
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Button
              onClick={handleFilter}
              disabled={!date}
              className="w-full md:w-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg  text-white"
            >
              <FilterIcon className="mr-2 h-4 w-4" />
              Filter
            </Button>
            {hasFiltered && (
              <Button
                onClick={clearFilter}
                variant="outline"
                className="w-full md:w-auto transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:text-red-500"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
