import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

const ContentValidationSchema = z
  .string()
  .max(1000, { message: "content max 1000" })
  .default("");

// Definisikan interface untuk body request
interface PatchRequestBody {
  content: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const classroomId = (await params).id;
    // Validasi classroomId
    if (!classroomId) {
      return NextResponse.json(
        { error: "Bad Request: Class ID is missing in the URL path." },
        { status: 400 }
      );
    }

    if (!z.string().uuid().safeParse(classroomId).success) {
      return NextResponse.json(
        { error: "Invalid ID Classroom" },
        { status: 400 }
      );
    }

    idClassCurrent = classroomId;
    const email = session.user.email;

    const body: PatchRequestBody = await request.json();
    const { content } = body;
    const updatecontent = ContentValidationSchema.parse(content);

    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .in("status", [0, 1])
        .single(); // Expect only one record

    if (userClassroomError) {
      console.error(
        "Supabase error fetching user_classroom:",
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

    const classroomIdToUpdate = userClassroomData.id_class;

    const { data, error } = await supabase
      .from("template")
      .update({ content: updatecontent })
      .eq("id_class", classroomIdToUpdate)
      .select();

    if (error) {
      console.error("Supabase error during template update:", error);
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
        { message: "template record to update not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} change template with IDclass ${classroomIdToUpdate} successfully.`;
    return NextResponse.json(
      { message: messageJson, updatedTemplate: data[0] },
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const classroomId = (await params).id;
    // Validasi classroomId
    if (!classroomId) {
      return NextResponse.json(
        { error: "Bad Request: Class ID is missing in the URL path." },
        { status: 400 }
      );
    }

    if (!z.string().uuid().safeParse(classroomId).success) {
      return NextResponse.json(
        { error: "Invalid ID Classroom" },
        { status: 400 }
      );
    }

    idClassCurrent = classroomId;
    const email = session.user.email;

    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .in("status", [0, 1])
        .single(); // Expect only one record

    if (userClassroomError) {
      console.error(
        "Supabase error fetching user_classroom:",
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

    const classroomIdToUpdate = userClassroomData.id_class;

    const { data, error } = await supabase
      .from("template")
      .insert({ id_class: classroomIdToUpdate })
      .select();

    if (error) {
      console.error("Supabase error during template add:", error);
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
        { message: "template record to Create not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} Create template with IDclass ${classroomIdToUpdate} successfully.`;
    return NextResponse.json(
      { message: messageJson, insertTemplate: data[0] },
      { status: 201 }
    );
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
