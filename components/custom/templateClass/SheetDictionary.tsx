import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import PlaceholderDictionary from "./PlaceholderDictionary";
import { FaInfoCircle } from "react-icons/fa";

export function SheetDictionary() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild className="-ml-4 -mt-7">
          <span>
            <Button variant="link">Explore Placeholders</Button>
          </span>
        </SheetTrigger>
        <SheetContent className="flex flex-col  gap-0">
          <SheetHeader>
            <SheetTitle>
              <span className="flex items-center">
                <FaInfoCircle className="text-blue-500 text-sm mr-3" />
                <span>Placeholder Template</span>
              </span>
            </SheetTitle>
            <SheetDescription>
              Use the placeholders below in your message template.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <PlaceholderDictionary />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="default">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
