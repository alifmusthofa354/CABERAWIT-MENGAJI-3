import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  let idClassCurrent: string | null = null;
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  try {
    // Ambil ID Kelas dari Path Parameter

    const classroomId = request.nextUrl.searchParams.get("id");

    idClassCurrent = classroomId;
    const email = session.user.email;

    let query = supabase
      .from("user_classroom")
      .select("id_class") // Select the id_class column which links to the classroom table
      .eq("email", email) // Filter by the authenticated user's email
      .in("status", [0, 1]); // Filter by status 0 or 1

    if (classroomId) {
      query = query.eq("id", classroomId);
    } else {
      query = query.order("created_at", { ascending: false }).limit(1);
    }
    const { data: userClassroomData, error: userClassroomError } = await query;

    if (userClassroomError) {
      console.error(
        "Supabase error fetching id class from user_classroom:",
        userClassroomError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, Please Try Again Later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    if (!userClassroomData) {
      // If no record is found, it means the user_classroom ID doesn't exist,
      // or the authenticated user is not the owner, or the email doesn't match.
      return NextResponse.json(
        {
          message:
            "User classroom record not found or user not authorized/owner.",
        },
        { status: 404 } // Or 403 Forbidden if record exists but user is not owner
      );
    }

    const IDClass = userClassroomData[0].id_class; // This is the actual class ID in the 'classroom' table

    // Update the `classroom` table using the obtained `classroomIdToUpdate`
    const { data, error } = await supabase
      .from("user_classroom")
      .select("id, isOwner,status,email,users(name, photo)") // Select the id_class column which links to the classroom table
      .eq("id_class", IDClass) // Filter by the user_classroom record ID
      .in("status", [0, 1]); // Filter by status 0 or 1

    if (error) {
      console.error("Supabase error fetching user classroom:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error, Please Try Again Later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      // This case might occur if classroomIdToUpdate was valid but the classroom record itself
      // was deleted between the two queries, or some other issue.
      return NextResponse.json(
        { message: "Classroom record or classroom not found." },
        { status: 404 }
      );
    }

    // Success Response

    return NextResponse.json({ people: data });
  } catch (error) {
    // Penanganan kesalahan jika body bukan JSON yang valid
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error, Please Try Again Later.",
        referenceId: idClassCurrent,
      },
      { status: 500 }
    );
  }
}
