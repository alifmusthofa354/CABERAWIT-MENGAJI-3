import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;
  const classroomId = request.nextUrl.searchParams.get("id");

  if (!classroomId) {
    return NextResponse.json(
      { error: "Classroom ID not provided" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("user_classroom")
      .select(
        `id, id_class, email, isOwner, status, classroom(id, name, description, image_url,kode,link_wa,status)`
      )
      .eq("email", email)
      .eq("id", classroomId)
      .gte("status", 0) // Menambahkan kondisi untuk user_classroom.status = 0
      .gte("classroom.status", 0)
      .lt("classroom.status", 2)
      .not("classroom", "is", null);

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
