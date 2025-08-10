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

type AttendanceDetailsType = {
  id: string;
  schedule: {
    name: string;
  };
  user_classroom: {
    email: string;
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
  console.log("AttendanceDetails:\n", AttendanceDetails);
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
                  <TableHead>ID</TableHead>
                  <TableHead>Acara</TableHead>
                  <TableHead>Pencatat</TableHead>
                  <TableHead>Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AttendanceDetails.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/histori/day/${item.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.id}
                      </Link>
                    </TableCell>
                    <TableCell>{item.schedule.name}</TableCell>
                    <TableCell>{item.user_classroom.email}</TableCell>
                    <TableCell>{formathour(item.created_at)}</TableCell>
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
