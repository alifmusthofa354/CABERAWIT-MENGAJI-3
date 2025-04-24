"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function SelectWithMoreDialog() {
  const allItems = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system1", label: "System1" },
    { value: "system2", label: "System2" },
    { value: "system3", label: "System3" },
    { value: "system4", label: "System4" },
    { value: "system5", label: "System5" },
    { value: "system6", label: "System6" },
    { value: "system7", label: "System7" },
    { value: "system8", label: "System8" },
    { value: "system9", label: "System9" },
    { value: "system10", label: "System10" },
    { value: "system11", label: "System11" },
  ];

  const initialVisibleCount = 5;
  const [visibleItems] = useState(allItems.slice(0, initialVisibleCount));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleShowMore = () => {
    setOpenDialog(true);
  };

  const handleSelectItem = (value: string) => {
    setSelectedValue(value);
    setOpenDialog(false);
  };

  return (
    <>
      <Select value={selectedValue} onValueChange={setSelectedValue}>
        <SelectTrigger className="w-min-[180px]">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          {visibleItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
          {allItems.length > initialVisibleCount && (
            <div
              className="px-2 py-1.5 cursor-pointer text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={handleShowMore}
            >
              More...
            </div>
          )}
        </SelectContent>
      </Select>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Classes</DialogTitle>
            <DialogDescription>
              Select a class from the list below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            {allItems.map((item) => (
              <button
                key={item.value}
                className={`w-full px-2 py-1.5 rounded-md text-left text-sm hover:bg-accent hover:text-accent-foreground ${
                  selectedValue === item.value
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
                onClick={() => handleSelectItem(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
