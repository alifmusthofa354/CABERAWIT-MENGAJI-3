import HeaderDashboard from "@/components/ui/HeaderDashboard";
import ClassList2 from "@/components/custom/ClassList2";
import AddClass from "@/components/custom/AddClass";

export default function Page() {
  return (
    <>
      <div className="min-h-svh bg-gray-50 @container flex flex-col">
        <div className="bg-white shadow-md p-3 sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between">
            <HeaderDashboard />
            <div className="pr-3">
              <AddClass mobile={false} />
            </div>
          </div>
        </div>
        <div className=" p-4 md:p-6 mt-1 min-w-full flex-1">
          <ClassList2 />
        </div>
        <div className="md:hidden fixed bottom-4 right-4">
          <AddClass mobile={true} circle={true} />
        </div>
      </div>
    </>
  );
}
