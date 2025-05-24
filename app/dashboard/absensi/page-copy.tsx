import { Payment, columns } from "./columns-copy";
import { DataTable } from "./data-table-copy";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "success",
      email: "alif@example.com",
    },
    {
      id: "828ed52f",
      amount: 200,
      status: "pending",
      email: "fauzan@example.com",
    },
    {
      id: "928ed52f",
      amount: 300,
      status: "success",
      email: "zelda@example.com",
    },
    {
      id: "a28ed52f",
      amount: 150,
      status: "failed",
      email: "budi@example.com",
    },
    {
      id: "b28ed52f",
      amount: 250,
      status: "success",
      email: "cindy@example.com",
    },
    {
      id: "c28ed52f",
      amount: 400,
      status: "pending",
      email: "diana@example.com",
    },
    {
      id: "d28ed52f",
      amount: 120,
      status: "success",
      email: "eko@example.com",
    },
    {
      id: "e28ed52f",
      amount: 320,
      status: "failed",
      email: "fitri@example.com",
    },
    {
      id: "f28ed52f",
      amount: 180,
      status: "success",
      email: "gita@example.com",
    },
    {
      id: "028ed52f",
      amount: 280,
      status: "pending",
      email: "harry@example.com",
    },
    {
      id: "128ed52f",
      amount: 500,
      status: "success",
      email: "irma@example.com",
    },
    {
      id: "228ed52f",
      amount: 90,
      status: "failed",
      email: "joko@example.com",
    },
    {
      id: "328ed52f",
      amount: 210,
      status: "success",
      email: "kiki@example.com",
    },
    {
      id: "428ed52f",
      amount: 350,
      status: "pending",
      email: "lina@example.com",
    },
    {
      id: "528ed52f",
      amount: 160,
      status: "success",
      email: "maman@example.com",
    },
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
