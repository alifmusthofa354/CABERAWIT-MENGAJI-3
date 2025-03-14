import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

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

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("classes")
      .insert([{ name, email }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Class created successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
