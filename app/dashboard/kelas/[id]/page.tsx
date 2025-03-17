//import ClassList from "./_components/ClassList";
import HeaderDashboard from "@/components/ui/HeaderDashboard";

export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-3">
          <button>Add Student</button>
        </div>
      </div>
      <div className="flex-grow bg-amber-100">
        <h1>ini kelas</h1>
      </div>
    </div>
  );
}
