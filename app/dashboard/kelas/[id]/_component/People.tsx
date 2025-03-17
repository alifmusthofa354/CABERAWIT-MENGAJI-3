// pages/index.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
const data = [
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

const People = () => {
  return (
    <div className="bg-white text-gray-900">
      <div className=" mx-auto px-4 py-0">
        <div className="mb-4">
          <Card className="gap-1 py-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <p className="text-2xl font-semibold">HeadMaster</p>
                <span className="text-gray-500">1 HeadMaster</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <Card className="gap-1 py-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <p className="text-2xl font-semibold">Teacher</p>
                <span className="text-gray-500">4 Teacher</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teachers.map((student, index) => (
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
            </CardContent>
          </Card>
        </div>
        <div className="mb-4">
          <Card className="gap-1 py-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <p className="text-2xl font-semibold">ClassMates</p>
                <span className="text-gray-500">4 student</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.map((student, index) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default People;
