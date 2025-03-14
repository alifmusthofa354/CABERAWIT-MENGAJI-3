import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Teacher name is required" },
      { status: 400 }
    );
  }

  try {
    // Mengambil data guru berdasarkan nama
    const { data, error } = await supabase
      .from("teachers")
      .select("id, name")
      .ilike("name", `%${name}%`); // `ilike` untuk pencarian case-insensitive

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ teachers: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { name } = await req.json();

  // Validasi input
  if (!name) {
    return NextResponse.json(
      { error: "Teacher name is required" },
      { status: 400 }
    );
  }

  try {
    // Menambahkan guru baru
    const { data, error } = await supabase
      .from("teachers")
      .insert([{ name }])
      .single(); // .single() karena hanya satu guru yang ditambahkan

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Teacher registered successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
