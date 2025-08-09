"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function HistoryDateFilter2() {
  const field = {
    value: new Date(),
    onChange: (date: Date) => {
      if (date > new Date()) {
        toast.error("Tanggal tidak boleh lebih dari hari ini");
      } else if (date < new Date("1900-01-01")) {
        toast.error("Tanggal tidak boleh sebelum tahun 1900");
      } else {
        // Handle valid date change
        console.log("Selected date:", date);
      }
    },
  };

  return (
    <>
      <p>Date of birth</p>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] pl-3 text-left font-normal",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
