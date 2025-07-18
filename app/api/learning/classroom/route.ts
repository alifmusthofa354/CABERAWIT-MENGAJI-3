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
      .select(`id, isOwner, classroom( name, description, image_url,status, link_wa )`)
      .eq("email", email)
      .in("status", [0, 1])
      .in("classroom.status", [0, 1])
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
