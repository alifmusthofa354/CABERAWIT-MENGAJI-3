import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formathour } from "@/util/dateFormatter";
import { ArrowRight } from "lucide-react";

type AttendanceDetailsType = {
  id: string;
  schedule: {
    name: string;
  };
  user_classroom: {
    email: string;
    users: {
      name: string;
    };
  };
  created_at: string;
};

export default function ListHistoryDay({
  AttendanceDetails,
}: {
  AttendanceDetails: AttendanceDetailsType[];
}) {
  const isLoading = false;
  const hasFiltered = true;

  return (
    <>
      <Card className="w-full transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-2xl">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading...</p>
            </div>
          ) : !hasFiltered ? (
            <div className="text-center py-8 text-gray-500">
              <p>Pilih tanggal terlebih dahulu untuk melihat konten.</p>
            </div>
          ) : AttendanceDetails.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada konten yang ditemukan untuk tanggal ini.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acara</TableHead>
                  <TableHead>Pencatat</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AttendanceDetails.map((item) => (
                  <TableRow
                    key={item.id}
                    className="relative cursor-pointer transition-colors hover:bg-muted/50 group" // Tambahkan group
                  >
                    <TableCell className="font-medium">
                      {item.schedule.name}
                      <Link
                        href={`/dashboard/histori/day/${item.id}`}
                        className="absolute inset-0 z-10"
                      />
                    </TableCell>
                    <TableCell>{item.user_classroom.users.name}</TableCell>
                    <TableCell>{formathour(item.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary group-active:text-primary" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
