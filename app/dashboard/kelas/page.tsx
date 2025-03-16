//import ClassList from "./_components/ClassList";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import ClassList2 from "./_components/ClassList2";
import AddClass from "./_components/AddClass";
export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-3">
          <AddClass />
        </div>
      </div>
      <div className="flex-grow bg-amber-100">
        <ClassList2 />
      </div>
    </div>
  );
}
