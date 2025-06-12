import DropDownMenuTeacher from "./Teachers/DropDownMenuTeacher";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import PeopleSkeleton from "./PeopleSkeleton";

type PeopleType = {
  id: string;
  isOwner: boolean;
  status: number;
  email: string;
  users: {
    name: string;
    photo: string;
  };
};

export default function TeacherList({
  teacher,
  isCanEdit,
  isLoading,
  isError,
}: {
  teacher: PeopleType[];
  isCanEdit: boolean;
  isLoading: boolean;
  isError: boolean;
}) {
  if (isError) {
    return <></>;
  }

  return (
    <>
      <div className="bg-white rounded-md shadow-lg overflow-hidden min-h-max mb-3">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <FaChalkboardTeacher className="text-blue-600 text-2xl md:text-3xl mr-2" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              Teacher
            </h1>
          </div>
          {isLoading ? (
            <>
              <PeopleSkeleton />
              <PeopleSkeleton />
            </>
          ) : (
            <>
              {" "}
              <div>
                {teacher.map((person, index) => (
                  <div key={index}>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar>
                          <AvatarImage
                            src={person.users.photo}
                            alt={person.users.name}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        {/* Flex container untuk nama dan status dengan flex-wrap */}
                        <div className="flex flex-wrap items-center ml-4">
                          <span className="mr-2 mb-1 sm:mb-0">
                            {person.users.name}
                          </span>{" "}
                          {/* Nama */}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              person.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {person.status === 1 ? "Active" : "Not Active"}
                          </span>
                        </div>
                      </div>
                      {isCanEdit && (
                        <DropDownMenuTeacher
                          idPeople={person.id}
                          isActive={person.status === 1}
                          namePeople={person.users.name}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
