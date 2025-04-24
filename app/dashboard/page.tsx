//import ClassList from "./_components/ClassList";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import ClassList2 from "./_components/ClassList2";
import AddClass from "@/components/custom/AddClass";

export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  return (
    <div className="flex flex-col min-h-svh relative">
      <header className="flex items-center justify-between sticky top-0 bg-white z-50">
        <HeaderDashboard />
        <div className="p-3">
          {/* Tombol Add Class untuk desktop */}
          <AddClass mobile={false} />
        </div>
      </header>
      <div className="flex-grow bg-amber-100  pb-16 md:pb-0">
        <ClassList2 />
      </div>
      {/* Tombol Add Class untuk mobile di pojok kanan bawah */}
      <div className="md:hidden fixed bottom-4 right-4">
        <AddClass mobile={true} />
      </div>
    </div>
  );
}
