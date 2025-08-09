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

const content = [
  { id: "1", title: "The Fall of the Berlin Wall", date: "2025-08-09" },
  {
    id: "2",
    title: "Signing of the Declaration of Independence",
    date: "2025-08-09",
  },
  { id: "3", title: "First Moon Landing", date: "1969-07-20" },
  //   { id: "4", title: "End of World War II", date: "1945-09-02" },
  //   { id: "5", title: "First computer was created", date: "1943-12-01" },
];

export default function ListHistoryDay() {
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
          ) : content.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Tidak ada konten yang ditemukan untuk tanggal ini.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/history-day/${item.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/history-day/${item.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        &rarr;
                      </Link>
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
