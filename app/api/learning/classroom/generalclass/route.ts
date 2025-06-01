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

  console.log("ID Classroom : ", classroomId);

  try {
    let query = supabase
      .from("user_classroom")
      .select(
        `id, id_class, email, isOwner, status, classroom(id, name, description, image_url,kode,link_wa,status)`
      )
      .eq("email", email)
      .gte("status", 0) // Adding condition for user_classroom.status >= 0
      .gte("classroom.status", 0)
      .lt("classroom.status", 2)
      .not("classroom", "is", null);

    if (classroomId) {
      query = query.eq("id", classroomId);
    } else {
      query = query.order("created_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database Error : ", { error: error.message });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: "No classroom" }, { status: 404 });
    }

    return NextResponse.json({ classes: data });
  } catch (error) {
    console.error("System Error while fething general classrrom : ", error);
    return NextResponse.json(
      { error: "System Error while fething general classrrom" },
      { status: 500 }
    );
  }
}
