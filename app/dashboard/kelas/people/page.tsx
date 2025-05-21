import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FaBookOpen } from "react-icons/fa";

const owner = [
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
    status: "active", // Tambahkan status
  },
];

const teachers = [
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
    status: "active", // Tambahkan status
  },
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
    status: "not active", // Tambahkan status
  },
];

const Students = [
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
    status: "active", // Tambahkan status
  },
  {
    name: "3403_Muhammad Fikri Ramadhan",
    image:
      "https://storage.googleapis.com/a1aa/image/6Qe0vx2TIe-YtC3TlAU_mq0Ifp4d4UCpR3HN1YIEJYA.jpg",
    status: "active", // Tambahkan status
  },
  {
    name: "Almizt",
    image:
      "https://storage.googleapis.com/a1aa/image/a4hhBauqNORGAuMSbUsjENaYHm1qssEFeMsE7IRdhrs.jpg",
    status: "not active", // Tambahkan status
  },
  {
    name: "Divka",
    image:
      "https://storage.googleapis.com/a1aa/image/eDj5x9R8eBEm9gwWwz-YXE6H3Y1kuEjUzTesMy-nz4M.jpg",
    status: "active", // Tambahkan status
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
      <div className=" mx-auto p-4 md:p-6 mt-1 min-h-max">
        {/* Owner Section */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Owner
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
                      <span className="ml-4">{person.name}</span>
                      {/* Tampilkan status */}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          person.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {person.status}
                      </span>
                    </div>
                    <Button variant="outline" size="icon">
                      <MoreVertical />
                    </Button>
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
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
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
                      <span className="ml-4">{person.name}</span>
                      {/* Tampilkan status */}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          person.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {person.status}
                      </span>
                    </div>
                    <Button variant="outline" size="icon">
                      <MoreVertical />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Active Section (Filtered by status: active) */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Student Active
              </h1>
            </div>
            <div>
              {Students.filter((student) => student.status === "active").map(
                (student, index) => (
                  <div key={index}>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarImage src={student.image} alt={student.name} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="ml-4">{student.name}</span>
                        {/* Tampilkan status */}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}
                        >
                          {student.status}
                        </span>
                      </div>
                      <Button variant="outline" size="icon">
                        <MoreVertical />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Student Not Active Section (Filtered by status: not active) */}
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Student Not Active
              </h1>
            </div>
            <div>
              {Students.filter(
                (student) => student.status === "not active"
              ).map((student, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage src={student.image} alt={student.name} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="ml-4">{student.name}</span>
                      {/* Tampilkan status */}
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800`}
                      >
                        {student.status}
                      </span>
                    </div>
                    <Button variant="outline" size="icon">
                      <MoreVertical />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
