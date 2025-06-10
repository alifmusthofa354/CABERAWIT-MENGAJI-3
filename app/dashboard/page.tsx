//import ClassList from "./_components/ClassList";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import ClassList2 from "@/components/custom/ClassList2";
import AddClass from "@/components/custom/AddClass";

export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  return (
    <>
      <div className="min-h-svh bg-gray-50 @container">
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <AddClass mobile={false} />
            </div>
          </div>
        </div>
        <div className=" mx-auto p-4 md:p-6 mt-1 min-h-max">
          <ClassList2 />
        </div>
        <div className="md:hidden fixed bottom-4 right-4">
          <AddClass mobile={true} circle={true} />
        </div>
      </div>
    </>
  );
}
