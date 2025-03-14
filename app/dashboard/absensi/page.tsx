import { Skeleton } from "@/components/ui/skeleton";
//import ClassList from "./_components/ClassList";
//import ClassList2 from "./_components/ClassList2";
export default function Page() {
  //const teacherId = 1; // Ganti dengan ID guru yang sesuai
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-amber-900 ">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 md:mt-2">
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-red-700" />
          <Skeleton className="aspect-video rounded-xl bg-muted/50" />
          <Skeleton className="aspect-video rounded-xl bg-muted/50 md:bg-green-700" />
        </div>
        <h1>Welcome to Absensi</h1>
        {/* <ClassList teacherId={teacherId} /> */}
        {/* <ClassList2 /> */}
        <p>ini absensi</p>
      </div>
    </>
  );
}
