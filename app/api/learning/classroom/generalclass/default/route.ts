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
    const { data, error } = await supabase
      .from("user_classroom")
      .select(
        `id, id_class, email, isOwner, status, classroom(id, name, description, image_url,kode,link_wa,status)`
      )
      .eq("email", email)
      .gte("status", 0) // Menambahkan kondisi untuk user_classroom.status = 0
      .gte("classroom.status", 0)
      .lt("classroom.status", 2)
      .not("classroom", "is", null)
      .order("created_at", { ascending: false }) // Urutkan berdasarkan created_at secara descending (terbaru di atas)
      .limit(1); // Ambil hanya 1 record

    // console.log(data);

    if (error) {
      console.log({ error: error.message });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No classroom" }, { status: 404 });
    }

    return NextResponse.json({ classes: data });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching classrooms" },
      { status: 500 }
    );
  }
}
