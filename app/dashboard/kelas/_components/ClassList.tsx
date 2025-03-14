// ClassList.tsx
"use client"; // Penting untuk React Query di App Router
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { fetchClasses } from "../_actions/ClassAction"; // Sesuaikan path

interface Class {
  id: number;
  name: string;
  email: string;
  users: {
    name: string;
  };
}

export default function ClassList() {
  const {
    data: classes,
    isLoading,
    isError,
    error,
  } = useQuery<Class[], Error>({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Daftar Kelas</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
        {/* Grid responsif */}
        {classes && classes.length > 0 ? (
          classes.map((kelas) => (
            <Card key={kelas.id} className="sm:aspect-[2/1] md:aspect-square">
              {" "}
              {/* Aspect ratio responsif */}
              <CardHeader>
                <CardTitle>{kelas.name}</CardTitle>
                <CardDescription>{kelas.users.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Expedita animi eum repellendus cum vero iure, dolorem
                  voluptatem possimus omnis quia maxime dicta atque pariatur,
                  reprehenderit soluta labore vitae aperiam ex.
                </p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>Tidak ada kelas.</p>
        )}
      </div>
    </div>
  );
}
