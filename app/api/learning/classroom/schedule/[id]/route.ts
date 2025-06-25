import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

const PostScheduleValidationSchema = z.object({
  name: z
    .string()
    .max(100, { message: "name max 100" })
    .min(1, { message: "name min 1" }),
});

const PatchScheduleValidationSchema = z.object({
  name: z
    .string()
    .max(100, { message: "name max 100" })
    .min(1, { message: "name min 1" }),
  idScheduleUpdate: z.string().uuid({ message: "Invalid ID Schedule" }),
});

// Definisikan interface untuk body request
interface PostRequestBody {
  name: string;
}

interface PatchRequestBody {
  name: string;
  idScheduleUpdate: string;
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

    const body: PostRequestBody = await request.json();
    const validatedData = PostScheduleValidationSchema.parse(body);

    const { name } = validatedData;

    // if (!idStudentUpdate)
    //   return NextResponse.json(
    //     {
    //       error: "Bad Request: idStudentUpdate is missing in the request body.",
    //     },
    //     { status: 400 }
    //   );

    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .in("status", [0, 1])
        .single(); // Expect only one record

    // Periksa apakah ada error DAN itu BUKAN error "tidak ditemukan baris" (PGRST116)
    if (userClassroomError && userClassroomError.code !== "PGRST116") {
      console.error(
        "Supabase error fetching classroom data:",
        userClassroomError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    // Jika classroomData null, berarti tidak ada kelas yang ditemukan (karena PGRST116 atau memang tidak ada data)
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

    // ORM cannot query insert, update, delete complex (only one table at a time) so we have to do it manually
    const classroomIdToUpdate = userClassroomData.id_class;

    const { data, error } = await supabase
      .from("schedule")
      .insert({ id_class: classroomIdToUpdate, name })
      .select();

    if (error) {
      console.error("Supabase error during schedule add:", error);
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
        { message: "schedule record to Create not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} Create schedule with IDclass ${classroomIdToUpdate} successfully.`;
    return NextResponse.json(
      { message: messageJson, insertSchedule: data[0] },
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
    const validatedData = PatchScheduleValidationSchema.parse(body);

    const { name, idScheduleUpdate } = validatedData;

    if (!idScheduleUpdate)
      return NextResponse.json(
        {
          error:
            "Bad Request: idScheduleUpdate is missing in the request body.",
        },
        { status: 400 }
      );

    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .in("status", [0, 1])
        .single(); // Expect only one record

    // Periksa apakah ada error DAN itu BUKAN error "tidak ditemukan baris" (PGRST116)
    if (userClassroomError && userClassroomError.code !== "PGRST116") {
      console.error(
        "Supabase error fetching classroom data:",
        userClassroomError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    // Jika classroomData null, berarti tidak ada kelas yang ditemukan (karena PGRST116 atau memang tidak ada data)
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

    // ORM cannot query insert, update, delete complex (only one table at a time) so we have to do it manually
    const classroomIdToUpdate = userClassroomData.id_class;

    const { data, error } = await supabase
      .from("schedule")
      .update({ name: name })
      .eq("id_class", classroomIdToUpdate)
      .eq("id", idScheduleUpdate)
      .in("status", [1])
      .select();

    if (error) {
      console.error("Supabase error during schedule add:", error);
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
        { message: "schedule record to update not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} update schedule with IDclass ${classroomIdToUpdate} successfully.`;
    return NextResponse.json(
      { message: messageJson, updatedTemplate: data[0] },
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

    if (!z.string().uuid().safeParse(classroomId).success) {
      return NextResponse.json(
        { error: "Invalid ID Classroom" },
        { status: 400 }
      );
    }

    idClassCurrent = classroomId;
    const email = session.user.email;

    const { idScheduleUpdate } = await request.json();

    if (!z.string().uuid().safeParse(idScheduleUpdate).success) {
      return NextResponse.json(
        { error: "Invalid ID Classroom" },
        { status: 400 }
      );
    }

    if (!idScheduleUpdate)
      return NextResponse.json(
        {
          error:
            "Bad Request: idScheduleUpdate is missing in the request body.",
        },
        { status: 400 }
      );

    const { data: userClassroomData, error: userClassroomError } =
      await supabase
        .from("user_classroom")
        .select("id_class") // Select the id_class column which links to the classroom table
        .eq("id", classroomId) // Filter by the user_classroom record ID
        .eq("email", email) // Filter by the authenticated user's email
        .in("status", [0, 1])
        .single(); // Expect only one record

    // Periksa apakah ada error DAN itu BUKAN error "tidak ditemukan baris" (PGRST116)
    if (userClassroomError && userClassroomError.code !== "PGRST116") {
      console.error(
        "Supabase error fetching classroom data:",
        userClassroomError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    // Jika classroomData null, berarti tidak ada kelas yang ditemukan (karena PGRST116 atau memang tidak ada data)
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

    // ORM cannot query insert, update, delete complex (only one table at a time) so we have to do it manually
    const classroomIdToUpdate = userClassroomData.id_class;

    const { data, error } = await supabase
      .from("schedule")
      .update({ status: -2 })
      .eq("id_class", classroomIdToUpdate)
      .eq("id", idScheduleUpdate)
      .in("status", [1])
      .select();

    if (error) {
      console.error("Supabase error during schedule deleted:", error);
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
        { message: "schedule record to delete not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} delete schedule with IDclass ${classroomIdToUpdate} successfully.`;
    return NextResponse.json({ message: messageJson }, { status: 200 });
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
