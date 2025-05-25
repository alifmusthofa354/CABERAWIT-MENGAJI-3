import AttedanceCode from "@/components/custom/absense/AttedanceCode";
import { Attendance, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Attendance[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      status: "P",
      id_sudent: "1",
      name: "alif musthofa",
    },
    {
      id: "828ed52f",
      status: "UA",
      id_sudent: "2",
      name: "fauzan minmah",
    },
    {
      id: "928ed52f",
      status: "P",
      id_sudent: "3",
      name: "zelda mezata uzumaki",
    },
    {
      id: "a28ed52f",
      status: "AWOL",
      id_sudent: "4",
      name: "budi budarsono",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <AttedanceCode />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
