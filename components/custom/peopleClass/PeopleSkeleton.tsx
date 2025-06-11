import { Skeleton } from "@/components/ui/skeleton";

export default function PeopleSkeleton() {
  return (
    <div className="flex items-center min-w-full my-3">
      {/* Skeleton untuk Avatar */}
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-8 ml-3 flex-1 " />
    </div>
  );
}
