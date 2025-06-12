import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

// Define the allowed statuses using a Zod enum
const AllowedStatusSchema = z.enum(["ACTIVE", "NON ACTIVE", "BAN", "REMOVE"], {
  message: "Status must be one of 'ACTIVE', 'NON ACTIVE', 'BAN', 'REMOVE'",
});

// Konfigurasi Zod untuk data teks
const PeopleUpdateSchema = z.object({
  status: AllowedStatusSchema,
  idPeopleUpdate: z.string().uuid({ message: "Invalid ID User Classroom" }),
});

// Definisikan tipe literal untuk status yang diizinkan
type AllowedStatus = "REMOVE" | "ACTIVE" | "NON ACTIVE" | "BAN";

// Definisikan interface untuk body request
interface PatchRequestBody {
  status?: AllowedStatus; // Status sekarang adalah salah satu dari tipe literal
  idPeopleUpdate?: string;
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
    const validatedData = PeopleUpdateSchema.parse(body);

    const { status, idPeopleUpdate } = validatedData;

    if (!idPeopleUpdate)
      return NextResponse.json(
        {
          error: "Bad Request: idPeopleUpdate is missing in the request body.",
        },
        { status: 400 }
      );

    // Validasi status
    // 4. Validasi status (sekarang sebagai string literal)
    const allowedStatuses: AllowedStatus[] = [
      "ACTIVE",
      "NON ACTIVE",
      "BAN",
      "REMOVE",
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
      case "BAN":
        numericalStatus = -2;
        break;
      case "REMOVE":
        numericalStatus = -1;
        break;
      case "NON ACTIVE":
        numericalStatus = 0;
        break;
      case "ACTIVE":
        numericalStatus = 1;
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
      .from("user_classroom")
      .update({ status: numericalStatus }) // Select the id_class column which links to the classroom table
      .eq("id_class", classroomIdToUpdate) // Filter by the user_classroom record ID
      .eq("id", idPeopleUpdate)
      .eq("isOwner", false) // Assume 'owner' is a boolean column and the user must be the owner
      .in("status", [-1, 0, 1])
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
      return NextResponse.json(
        { message: "Peple record to update not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "People record updated successfully.",
        updatedPeople: data[0],
      },
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
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
