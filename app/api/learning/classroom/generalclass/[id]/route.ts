import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Konfigurasi Zod untuk data teks
const classSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  description: z
    .string()
    .max(255, { message: "description max 255" })
    .optional(),
  waGrup: z
    .string()
    .url("Invalid URL for WhatsApp group.") // Harus berupa URL jika ada
    .optional() // Boleh tidak ada
    .or(z.literal("")), // Atau boleh berupa string kosong jika itu yang Anda inginkan
});

async function uploadImageToSupabase(file: File): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("cover-class-caberawit") // Ganti dengan nama bucket Anda
    .upload(`${uuidv4()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image to Supabase:", error);
    return null;
  }

  return supabase.storage.from("cover-class-caberawit").getPublicUrl(data.path)
    .data.publicUrl;
}

export async function PUT(
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

  const email = session.user.email;

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
    const rawDescription = formData.get("description") as string | null;
    const rawWaGrup = formData.get("waGrup") as string | null;
    const rawImageFile = formData.get("image") as Blob | null;

    // 2. Buat objek yang akan divalidasi oleh Zod
    // Zod akan melakukan type coercion jika memungkinkan, tapi lebih baik eksplisit
    const dataToValidate = {
      name: rawName,
      description: rawDescription,
      waGrup: rawWaGrup,
    };

    // 3. Validasi data teks menggunakan Zod
    const validatedFields = classSchema.parse(dataToValidate); // <-- Menggunakan dataToValidate yang sudah dibuat
    // Destructuring dari hasil validasi (validatedFields)
    const { name, description, waGrup } = validatedFields; // <-- Sekarang tidak ada redeklarasi

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
      return NextResponse.json(
        { message: "No image file provided." },
        { status: 400 }
      );
    }

    const classroomIdToUpdate = userClassroomData.id_class; // This is the actual class ID in the 'classroom' table

    // Update the `classroom` table using the obtained `classroomIdToUpdate`
    const { data, error } = await supabase
      .from("classroom") // Your classroom table name
      .update({ name, description, link_wa: waGrup, image_url: imageUrl }) // Update the 'status' column with the numerical value
      .eq("id", classroomIdToUpdate) // Update based on the actual class ID
      .gte("status", 0)
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
    const messageJson = `${email} change Classroom with ID ${classroomIdToUpdate} successfully.`;
    return NextResponse.json(
      { message: messageJson, updatedClass: data[0] },
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

const updateClassSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100).optional(),
  description: z
    .string()
    .max(255, { message: "description max 255" })
    .optional(),
  link_wa: z
    .string()
    .url("Invalid URL for WhatsApp group.") // Harus berupa URL jika ada
    .optional() // Boleh tidak ada
    .or(z.literal("")), // Atau boleh berupa string kosong jika itu yang Anda inginkan
});

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

  const email = session.user.email;

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
    const rawDescription = formData.get("description") as string | null;
    const rawWaGrup = formData.get("waGrup") as string | null;

    // 2. Buat objek yang akan divalidasi oleh Zod
    // Zod akan melakukan type coercion jika memungkinkan, tapi lebih baik eksplisit
    const dataToValidate: {
      name?: string;
      description?: string;
      link_wa?: string;
    } = {};

    if (rawName !== null && rawName.trim() !== "") {
      dataToValidate.name = rawName;
    }

    if (rawDescription !== null && rawDescription.trim() !== "") {
      dataToValidate.description = rawDescription;
    }

    if (rawWaGrup !== null && rawWaGrup.trim() !== "") {
      dataToValidate.link_wa = rawWaGrup;
    }

    // Validasi data teks menggunakan Zod
    const validatedFields = updateClassSchema.parse(dataToValidate); // <-- Menggunakan dataToValidate yang sudah dibuat

    const classroomIdToUpdate = userClassroomData.id_class; // This is the actual class ID in the 'classroom' table

    // Supabase hanya akan mengupdate kolom yang ada di objek `validatedFields`
    const { data, error } = await supabase
      .from("classroom") // Nama tabel classroom Anda
      .update(validatedFields) // Langsung gunakan validatedFields karena sudah bersih
      .eq("id", classroomIdToUpdate) // Update berdasarkan ID kelas aktual
      .gte("status", 0) // Pastikan status lebih besar atau sama dengan 0
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
    const messageJson = `${email} change Classroom with ID ${classroomIdToUpdate} successfully.`;
    return NextResponse.json(
      { message: messageJson, updatedClass: data[0] },
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
