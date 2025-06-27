import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

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
    if (classroomId) {
      if (!z.string().uuid().safeParse(classroomId).success) {
        return NextResponse.json(
          { error: "Invalid ID Classroom" },
          { status: 400 }
        );
      }
    }

    idClassCurrent = classroomId;
    const email = session.user.email;

    let query = supabase
      .from("user_classroom")
      .select("id_class, id") // Select the id_class column which links to the classroom table
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

    if (!userClassroomData || userClassroomData.length === 0) {
      if (classroomId) {
        return NextResponse.json(
          {
            message:
              "User classroom record not found or user not authorized/owner.",
          },
          { status: 404 } // Or 403 Forbidden if record exists but user is not owner
        );
      } else {
        return NextResponse.json(
          {
            message: "Anda belum membuat kelas apa pun. ",
            action: "create_class",
            data: null,
          },
          { status: 200 } // Mengembalikan 200 OK karena permintaan berhasil diproses
        );
      }
    }

    if (!classroomId) {
      idClassCurrent = userClassroomData[0].id;
    }

    const IDClass = userClassroomData[0].id_class; // This is the actual class ID in the 'classroom' table

    // Update the `classroom` table using the obtained `classroomIdToUpdate`
    const { data, error } = await supabase
      .from("schedule")
      .select("id, name") // Select the id_class column which links to the classroom table
      .eq("id_class", IDClass) // Filter by the user_classroom record ID
      .in("status", [1]) // Filter by status 0 or 1
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase error fetching schedule:", error);
      return NextResponse.json(
        {
          error: "Internal Server Error, Please Try Again Later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { schedules: [], idClassCurrent },
        { status: 200 }
      );
    }

    // Success Response
    return NextResponse.json(
      { schedules: data, idClassCurrent },
      { status: 200 }
    );
  } catch (error) {
    // Penanganan kesalahan jika body bukan JSON yang valid
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // --- PENANGANAN ERROR ZOD YANG DISEMPURNAKAN ---
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten().fieldErrors, // Memberikan detail error per field
          // Atau jika Anda ingin semua issues: issues: error.errors
        },
        { status: 400 } // Bad Request
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
