import SelectClass from "@/components/custom/SelectClass";
import HeaderDashboard from "@/components/ui/HeaderDashboard";
import { Skeleton } from "@/components/ui/skeleton";
export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-4">
          <SelectClass />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-amber-900 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 md:mt-2">
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-red-700" />
        </div>
        <h1>Welcome to 1 Histori</h1>
        <p>ini absensi</p>
      </div>
    </>
  );
}
