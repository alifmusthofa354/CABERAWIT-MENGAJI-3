import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
import { FaBookOpen } from "react-icons/fa";
const owner = [
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
  },
];

const teachers = [
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
  },
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
  },
];
// Menyimpan data dalam const 'data'
const Students = [
  {
    name: "3383_Hernawan Wahyu Adji",
    image:
      "https://storage.googleapis.com/a1aa/image/0JT47OeluUqA1C_7p57eY932cGzcvu5nMwdJkuDPSpY.jpg",
  },
  {
    name: "3403_Muhammad Fikri Ramadhan",
    image:
      "https://storage.googleapis.com/a1aa/image/6Qe0vx2TIe-YtC3TlAU_mq0Ifp4d4UCpR3HN1YIEJYA.jpg",
  },
  {
    name: "Almizt",
    image:
      "https://storage.googleapis.com/a1aa/image/a4hhBauqNORGAuMSbUsjENaYHm1qssEFeMsE7IRdhrs.jpg",
  },
  {
    name: "Divka",
    image:
      "https://storage.googleapis.com/a1aa/image/eDj5x9R8eBEm9gwWwz-YXE6H3Y1kuEjUzTesMy-nz4M.jpg",
  },
];

export default function Page() {
  // const idClass = 3;
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
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Owner
              </h1>
            </div>
            <div>
              {owner.map((student, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="ml-4">{student.name}</span>
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
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Teacher
              </h1>
            </div>
            <div>
              {teachers.map((teacher, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="ml-4">{teacher.name}</span>
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
        <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
          <div className="p-4">
            <div className="flex items-center mb-3">
              <FaBookOpen className="text-blue-600 text-2xl md:text-3xl mr-2" />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                Student Active
              </h1>
            </div>
            <div>
              {Students.map((student, index) => (
                <div key={index}>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span className="ml-4">{student.name}</span>
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
