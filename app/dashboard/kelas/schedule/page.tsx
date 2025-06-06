import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Separator } from "@/components/ui/separator";
import { FaCalendarAlt } from "react-icons/fa";

import AddButtonSchedule from "@/components/custom/scheduleClass/AddButtonSchedule";
import DropDownMenuSchedule from "@/components/custom/scheduleClass/DropDownMenuSchedule";

// Data dengan properti status
const schedules = [
  {
    name: "Caberawit Pagi",
  },
  {
    name: "Caberawit Siang",
  },
  {
    name: "Caberawit Sore",
  },
  {
    name: "Caberawit Malam",
  },
  {
    name: "Caberawit Shubuh",
  },
];

export default function Page() {
  return (
    <div className="min-h-svh bg-gray-50 @container">
      <div className="bg-white shadow-md p-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <HeaderDashboard />
          <div className="pr-3">
            <SelectClass />
          </div>
        </div>
      </div>
      <div className=" mx-auto p-4 md:p-6 pb-18 md:pb-18  mt-1 min-h-max ">
        {/* Owner Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaCalendarAlt className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Schedule
              </h1>
            </div>
            <div>
              {schedules.map((schedule, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h3>{schedule.name}</h3>
                    </div>
                    <DropDownMenuSchedule idClass={index} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 right-4">
          <AddButtonSchedule idClass={3} />
        </div>
      </div>
    </div>
  );
}
