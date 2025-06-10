import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

// Definisikan tipe literal untuk status yang diizinkan
type AllowedStatus = "DELETE" | "ACTIVE" | "NON ACTIVE" | "ARCHIVE";

// Definisikan interface untuk body request
interface PatchRequestBody {
  status?: AllowedStatus; // Status sekarang adalah salah satu dari tipe literal
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

    idClassCurrent = classroomId;
    const email = session.user.email;

    const body: PatchRequestBody = await request.json();
    const { status } = body;

    // Validasi status
    // 4. Validasi status (sekarang sebagai string literal)
    const allowedStatuses: AllowedStatus[] = [
      "DELETE",
      "ACTIVE",
      "NON ACTIVE",
      "ARCHIVE",
    ];
    if (typeof status !== "string" || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid request body: 'status' is required and must be one of: ${allowedStatuses.join(
            ", "
          )}.`,
        },
        { status: 400 }
      );
    }

    // 5. Ubah status string menjadi nilai numerik
    let numericalStatus: number;
    switch (status) {
      case "DELETE":
        numericalStatus = -1;
        break;
      case "NON ACTIVE":
        numericalStatus = 0;
        break;
      case "ACTIVE":
        numericalStatus = 1;
        break;
      case "ARCHIVE":
        numericalStatus = 2;
        break;
      default:
        // Ini seharusnya tidak tercapai karena sudah divalidasi di atas,
        // tetapi sebagai fallback yang aman.
        console.error("Internal Server Error: Invalid status mapping.", status);
        return NextResponse.json(
          {
            error: "Internal Server Error, Please Try Again Later.",
            referenceId: idClassCurrent,
          },
          { status: 500 }
        );
    }

    // ORM cannot query insert, update, delete complex (only one table at a time) so we have to do it manually
    // Find the `id_class` from the `user_classroom` table
    // Filter by the user_classroom record ID, authenticated user's email, and owner = true
    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .eq("isOwner", true) // Assume 'owner' is a boolean column and the user must be the owner
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

    const classroomIdToUpdate = userClassroomData.id_class; // This is the actual class ID in the 'classroom' table

    // Update the `classroom` table using the obtained `classroomIdToUpdate`
    const { data, error } = await supabase
      .from("classroom") // Your classroom table name
      .update({ status: numericalStatus }) // Update the 'status' column with the numerical value
      .eq("id", classroomIdToUpdate) // Update based on the actual class ID
      .in("status", [0, 1, 2])
      .select();

    if (error) {
      console.error("Supabase error during classroom update:", error);
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
        { message: "Classroom record to update not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} change Classroom with ID ${classroomIdToUpdate} to ${status} successfully.`;
    return NextResponse.json(
      { message: messageJson, updatedClass: data[0] },
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

export async function DELETE(
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

    idClassCurrent = classroomId;
    const email = session.user.email;

    // ORM cannot query insert, update, delete complex (only one table at a time) so we have to do it manually
    // Find the `id_class` from the `user_classroom` table
    // Filter by the user_classroom record ID, authenticated user's email, and owner = true
    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .eq("isOwner", true) // Assume 'owner' is a boolean column and the user must be the owner
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

    const classroomIdToUpdate = userClassroomData.id_class; // This is the actual class ID in the 'classroom' table

    // Update the `classroom` table using the obtained `classroomIdToUpdate`
    const { data, error } = await supabase
      .from("classroom") // Your classroom table name
      .update({ status: -1 }) // Update the 'status' to -1 / delete
      .eq("id", classroomIdToUpdate) // Update based on the actual class ID
      .in("status", [0, 1, 2])
      .select();

    if (error) {
      console.error("Supabase error during classroom update:", error);
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
        { message: "Classroom record to update not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} change Classroom with ID ${classroomIdToUpdate} to delete successfully.`;
    return NextResponse.json(
      { message: messageJson, updatedClass: data[0] },
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
