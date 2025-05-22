import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FaGraduationCap, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import DropDownMenuTeacher from "@/components/custom/peopleClass/Teachers/DropDownMenuTeacher";
import DropDownMenuStudent from "@/components/custom/peopleClass/Students/DropDownMenuStudent";
import AddStudent from "@/components/custom/peopleClass/Students/AddButtonStudent";

// Data dengan properti status
const owner = [
  {
    name: "Muhammad Alif Musthofa",
    image: "https://avatar.iran.liara.run/public/50",
    status: "active",
  },
];

const teachers = [
  {
    name: "KAIDO",
    image: "https://xsgames.co/randomusers/avatar.php?g=male",
    status: "active",
  },
  {
    name: "3383_Hernawan Wahyu Adji Yang Namanya Cukup Panjang Sekali", // Contoh nama panjang
    image: "https://avatar.iran.liara.run/public/37",
    status: "not active",
  },
];

const Students = [
  {
    name: "Dea Putri Handayani",
    image: "https://xsgames.co/randomusers/avatar.php?g=female",
    status: "active",
  },
  {
    name: "3403_Muhammad Fikri Ramadhan Dengan Nama Yang Sangat Sangat Panjang Sekali", // Contoh nama sangat panjang
    image:
      "https://storage.googleapis.com/a1aa/image/6Qe0vx2TIe-YtC3TlAU_mq0Ifp4d4UCpR3HN1YIEJYA.jpg",
    status: "active",
  },
  {
    name: "Almizt",
    image:
      "https://storage.googleapis.com/a1aa/image/a4hhBauqNORGAuMSbUsjENaYHm1qssEFeMsE7IRdhrs.jpg",
    status: "not active",
  },
  {
    name: "Divka",
    image:
      "https://storage.googleapis.com/a1aa/image/eDj5x9R8eBEm9gwWwz-YXE6H3Y1kuEjUzTesMy-nz4M.jpg",
    status: "active",
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
              <FaGraduationCap className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                HeadMaster
              </h1>
            </div>
            <div>
              {owner.map((person, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={person.image} alt={person.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* Flex container untuk nama dan status dengan flex-wrap */}
                      <div className="flex flex-wrap items-center ml-4">
                        <span className="mr-2 mb-1 sm:mb-0">{person.name}</span>{" "}
                        {/* Nama */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            person.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {person.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Teacher Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaChalkboardTeacher className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Teacher
              </h1>
            </div>
            <div>
              {teachers.map((person, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={person.image} alt={person.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* Flex container untuk nama dan status dengan flex-wrap */}
                      <div className="flex flex-wrap items-center ml-4">
                        <span className="mr-2 mb-1 sm:mb-0">{person.name}</span>{" "}
                        {/* Nama */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            person.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {person.status}
                        </span>
                      </div>
                    </div>
                    <DropDownMenuTeacher idClass={index} isActive={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Active Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaUsers className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Students
              </h1>
            </div>
            <div>
              {Students.map((student, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {/* Flex container untuk nama dan status dengan flex-wrap */}
                      <div className="flex flex-wrap items-center ml-4">
                        <span className="mr-2 mb-1 sm:mb-0">
                          {student.name}
                        </span>{" "}
                        {/* Nama */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            student.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </div>
                    </div>
                    <DropDownMenuStudent idClass={index} isActive={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="fixed bottom-4 right-4">
          <AddStudent idClass={3} />
        </div>
      </div>
    </div>
  );
}
