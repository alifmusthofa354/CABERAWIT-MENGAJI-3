import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function AttedanceCode() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Attedance Code</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
          Attendance state code
        </h3>

        <ul className="space-y-3">
          <li className="flex items-center">
            <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mr-3 min-w-[50px] text-center">
              P
            </span>
            <span className="text-gray-700">
              Hadir <span className="font-medium">(Present)</span>
            </span>
          </li>
          <li className="flex items-center">
            <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full mr-3 min-w-[50px] text-center">
              UA
            </span>
            <span className="text-gray-700">
              Tidak Hadir Tanpa Izin{" "}
              <span className="font-medium">(Unauthorized Absence)</span>
            </span>
          </li>
          <li className="flex items-center">
            <span className="bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full mr-3 min-w-[50px] text-center">
              AWOL
            </span>
            <span className="text-gray-700">
              Tidak Hadir Dengan Izin{" "}
              <span className="font-medium">(Absent Without Leave)</span>
            </span>
          </li>
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
