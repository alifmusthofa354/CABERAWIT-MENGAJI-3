"use client";

import useStore from "@/stores/useStoreClass";
//import ClassList from "./_components/ClassList";
import HeaderDashboard from "@/components/ui/HeaderDashboard";

//import { DataTableDemo } from "./_component/Table";
import { TabsDemo } from "./_component/Tab";
import SelectClass from "@/components/custom/SelectClass";
// import SelectClassWithMore from "@/components/custom/SelectClassWithMore";
//import TabsDemo2 from "./_component/Tabs2";

export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  const { selectedClassName } = useStore();

  return (
    <div className="flex flex-col min-h-svh">
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-3">
          <SelectClass />
        </div>
      </div>
      <div className="flex-grow bg-amber-100">
        <div className="p-2 bg-amber-50 h-full">
          <h2>{selectedClassName}</h2>

          <TabsDemo />
        </div>
      </div>
    </div>
  );
}
