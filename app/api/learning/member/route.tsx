import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;

  try {
    // const { data, error } = await supabase
    //   .from("classroom")
    //   .select("id, name, email, users (name)") // Menggunakan alias user:name untuk mengambil nama dari tabel user
    //   .eq("email", email);
    const { data, error } = await supabase
      .from("classroom")
      .select("id, name, email") // Menggunakan alias user:name untuk mengambil nama dari tabel user
      .eq("email", email);

    if (error) {
      console.log({ error: error.message });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No classroom" }, { status: 404 });
    }

    return NextResponse.json({ classes: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// Skema validasi menggunakan Zod
const classSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
});

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;

  try {
    if (req.headers.get("Content-Type") !== "application/json") {
      return NextResponse.json(
        { error: "Invalid Content-Type" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Validasi menggunakan Zod
    const validatedBody = classSchema.parse(body);

    const { name } = validatedBody;

    const { data, error } = await supabase
      .from("classroom")
      .insert([{ name, email }]);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Class created successfully", data },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Penanganan error validasi Zod
      console.log({ error: error.errors });
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("General error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
