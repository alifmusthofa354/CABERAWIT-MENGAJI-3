import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Konfigurasi Zod untuk data teks
const StudentPostSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
});

const StudentUpdateSchema = z.object({
  name: z.string().max(100).optional().nullable(),
  idStudentUpdate: z.string().uuid({ message: "Invalid ID Student" }),
});

type StudentUpdateDataSchema = {
  name?: string;
  photo?: string;
};

async function uploadImageToSupabase(file: File): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("image-caberawit") // Ganti dengan nama bucket Anda
    .upload(`${uuidv4()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image to Supabase:", error);
    return null;
  }

  return supabase.storage.from("image-caberawit").getPublicUrl(data.path).data
    .publicUrl;
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
        .select("id_class")
        .eq("id", classroomId)
        .eq("email", email)
        .eq("isOwner", true)
        .single();

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

    const formData = await request.formData();
    // Mengambil field teks dari formData
    const rawName = formData.get("name") as string | null;
    const rawImageFile = formData.get("image") as Blob | null;

    // 2. Buat objek yang akan divalidasi oleh Zod
    // Zod akan melakukan type coercion jika memungkinkan, tapi lebih baik eksplisit
    const dataToValidate = {
      name: rawName,
    };

    // 3. Validasi data teks menggunakan Zod
    const validatedFields = StudentPostSchema.parse(dataToValidate); // <-- Menggunakan dataToValidate yang sudah dibuat
    // Destructuring dari hasil validasi (validatedFields)
    const { name } = validatedFields; // <-- Sekarang tidak ada redeklarasi

    // 4. Dapatkan data Gambar
    let imageUrl: string | null = null;
    if (rawImageFile) {
      const imageFile = Array.isArray(rawImageFile)
        ? rawImageFile[0]
        : rawImageFile;

      imageUrl = await uploadImageToSupabase(imageFile);
      if (!imageUrl) {
        return NextResponse.json(
          {
            error: "Internal Server Error, Please Try Again Later.",
            referenceId: idClassCurrent,
          },
          { status: 500 }
        );
      }
    } else {
      imageUrl = "https://nybxzkiebrcyzvunjmig.supabase.co/storage/v1/object/public/image-caberawit/default/953491a9-15a7-457c-be06-2b7876296ae2-photo-user-default.webp"
    }

    const classroomIdToUpdate = userClassroomData.id_class; // This is the actual class ID in the 'classroom' table

    const { data, error } = await supabase
      .from("students")
      .insert({
        id_class: classroomIdToUpdate,
        name: name,
        photo: imageUrl,
        status: 1,
      })
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
        { message: "Add Student not return data." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Add Students successfully.",
        students: data[0],
      },
      { status: 200 }
    );
  } catch (error) {
    // Tangani error jika tidak ada multipart/form-data
    // Penanganan error spesifik untuk Content-Type
    if (
      error instanceof TypeError &&
      error.message.includes("Content-Type was not one of")
    ) {
      return NextResponse.json(
        {
          error: "Invalid Content-Type",
          message:
            'The request body must be "multipart/form-data" or "application/x-www-form-urlencoded".',
        },
        { status: 400 } // Bad Request
      );
    }
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

    const formData = await request.formData();
    // Mengambil field teks dari formData
    const rawName = formData.get("name") as string | null;
    const rawImageFile = formData.get("image") as Blob | null;
    const rawidStudentUpdate = formData.get("idStudentUpdate") as string | null;

    if (!rawName && !rawImageFile) {
      return NextResponse.json(
        { error: "Bad Request: Missing required fields." },
        { status: 400 }
      );
    }

    // 2. Buat objek yang akan divalidasi oleh Zod
    // Zod akan melakukan type coercion jika memungkinkan, tapi lebih baik eksplisit
    const dataToValidate = {
      name: rawName,
      idStudentUpdate: rawidStudentUpdate,
    };

    // 3. Validasi data teks menggunakan Zod
    const validatedFields = StudentUpdateSchema.parse(dataToValidate); // <-- Menggunakan dataToValidate yang sudah dibuat
    // Destructuring dari hasil validasi (validatedFields)
    const { name, idStudentUpdate } = validatedFields; // <-- Sekarang tidak ada redeklarasi

    // 4. Dapatkan data Gambar
    let imageUrl: string | null = null;
    if (rawImageFile) {
      const imageFile = Array.isArray(rawImageFile)
        ? rawImageFile[0]
        : rawImageFile;

      imageUrl = await uploadImageToSupabase(imageFile);
      if (!imageUrl) {
        return NextResponse.json(
          {
            error: "Internal Server Error, Please Try Again Later.",
            referenceId: idClassCurrent,
          },
          { status: 500 }
        );
      }
    }

    const updateData: StudentUpdateDataSchema = {};

    if (name) {
      updateData.name = name;
    }
    if (imageUrl) {
      updateData.photo = imageUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Bad Request: Missing required fields." },
        { status: 400 }
      );
    }
    const classroomIdToUpdate = userClassroomData.id_class; // This is the actual class ID in the 'classroom' table

    const { data, error } = await supabase
      .from("students")
      .update(updateData)
      .eq("id_class", classroomIdToUpdate)
      .eq("id", idStudentUpdate)
      .in("status", [0, 1])
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
        message: "Students  updated successfully.",
        students: data[0],
      },
      { status: 200 }
    );
  } catch (error) {
    // Tangani error jika tidak ada multipart/form-data
    // Penanganan error spesifik untuk Content-Type
    if (
      error instanceof TypeError &&
      error.message.includes("Content-Type was not one of")
    ) {
      return NextResponse.json(
        {
          error: "Invalid Content-Type",
          message:
            'The request body must be "multipart/form-data" or "application/x-www-form-urlencoded".',
        },
        { status: 400 } // Bad Request
      );
    }
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
