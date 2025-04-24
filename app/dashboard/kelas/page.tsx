import { Skeleton } from "@/components/ui/skeleton";
import HeaderDashboard from "@/components/ui/HeaderDashboard";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between">
        <HeaderDashboard />
        <div className="p-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-lg bg-white px-5 py-3.5 text-base/5 shadow-sm font-semibold text-black">
          <div className="">Chart</div>
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-red-700" />
          <Skeleton className="aspect-video rounded-xl bg-muted/50" />
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-green-700" />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-green-700" />
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-amber-700" />
        </div>
        <Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-60 md:bg-red-700" />
        <Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-60 md:bg-sky-700" />
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-blue-500" />
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-purple-500" />
        </div>
      </div>
    </>
  );
}
