//import ClassList from "./_components/ClassList";
import HeaderDashboard from "@/components/ui/HeaderDashboard";

//import { DataTableDemo } from "./_component/Table";
import { TabsDemo } from "./_component/Tab";
//import TabsDemo2 from "./_component/Tabs2";

export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-3">
          <h6>CABERAWIT 2</h6>
        </div>
      </div>
      <div className="flex-grow bg-amber-100">
        <div className="p-2 bg-amber-50 h-full">
          <TabsDemo />
        </div>
      </div>
    </div>
  );
}
