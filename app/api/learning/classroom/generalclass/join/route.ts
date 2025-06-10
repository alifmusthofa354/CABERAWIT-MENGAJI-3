import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

// Konfigurasi Zod untuk data teks
const joinClassSchema = z.object({
  codeClass: z.string().uuid({ message: "Invalid Code Class" }),
});

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized: User session or email not found." },
      { status: 401 }
    );
  }

  const email = session.user.email;

  try {
    const body = await request.json(); // Type inference is usually fine here
    const validatedBody = joinClassSchema.parse(body);
    const { codeClass } = validatedBody;

    // 1. Cari kelas berdasarkan kode dan status aktif
    const { data: classroomData, error: classroomError } = await supabase
      .from("classroom")
      .select("id")
      .eq("kode", codeClass)
      .in("status", [0, 1]) // Asumsi 0 dan 1 adalah status aktif/valid
      .single(); // Harapkan hanya satu kelas dengan kode ini

    // Periksa apakah ada error DAN itu BUKAN error "tidak ditemukan baris" (PGRST116)
    if (classroomError && classroomError.code !== "PGRST116") {
      console.error("Supabase error fetching classroom data:", classroomError);
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
        },
        { status: 500 }
      );
    }

    // Jika classroomData null, berarti tidak ada kelas yang ditemukan (karena PGRST116 atau memang tidak ada data)
    if (!classroomData) {
      return NextResponse.json(
        {
          message: "Classroom not found. Please check the code and try again.",
        },
        { status: 404 }
      );
    }

    // 2. Cek apakah user sudah terdaftar di kelas ini
    // Penting: `.single()` akan mengembalikan error jika 0 atau >1 baris ditemukan.
    // Jika Anda mengharapkan 0 atau 1 baris, tangani 'details: The result contains 0 rows' sebagai "tidak ditemukan".
    const { data: existingUserClassroom, error: existingUserClassroomError } =
      await supabase
        .from("user_classroom")
        .select("status")
        .eq("id_class", classroomData.id)
        .eq("email", email)
        .single(); // Harapkan satu atau tidak ada hasil

    if (
      existingUserClassroomError &&
      existingUserClassroomError.code !== "PGRST116"
    ) {
      // PGRST116 berarti 'The result contains 0 rows', yang bukan error yang sebenarnya di sini.
      // Kita hanya log error lain selain PGRST116
      console.error(
        "Supabase error fetching existing user classroom data:",
        existingUserClassroomError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
        },
        { status: 500 }
      );
    }

    // 3. Logika berdasarkan status user di kelas
    if (existingUserClassroom) {
      // Pengguna sudah memiliki entri di user_classroom
      if (existingUserClassroom.status === -1) {
        // Status -1: Pengguna sebelumnya dikeluarkan/tidak aktif, coba aktifkan kembali
        const { data: updateResult, error: updateError } = await supabase
          .from("user_classroom")
          .update({ status: 0 }) // Update status menjadi aktif (0)
          .eq("id_class", classroomData.id)
          .eq("email", email)
          .select() // Mengambil data yang diperbarui
          .single(); // Harapkan satu baris yang diperbarui

        if (updateError) {
          console.error(
            "Supabase error updating user_classroom status:",
            updateError
          );
          return NextResponse.json(
            { error: "Internal Server Error, please try again later." },
            { status: 500 }
          );
        }

        if (!updateResult) {
          // Ini seharusnya tidak terjadi jika query .eq() cocok
          return NextResponse.json(
            { message: "Failed to update classroom status. Please try again." },
            { status: 500 }
          );
        }

        return NextResponse.json(
          { message: "Class joined successfully (status updated).", codeClass },
          { status: 200 }
        );
      } else if (
        existingUserClassroom.status === 0 ||
        existingUserClassroom.status === 1
      ) {
        // Status 0 atau 1: Pengguna sudah aktif di kelas
        return NextResponse.json(
          { message: "You have already joined this classroom." },
          { status: 400 }
        );
      } else if (existingUserClassroom.status === -2) {
        // Status -2: Pengguna dilarang bergabung
        return NextResponse.json(
          {
            message:
              "You are banned from joining this classroom. Please contact the admin.",
          },
          { status: 403 } // 403 Forbidden lebih tepat daripada 400
        );
      } else {
        // Status tidak terduga
        console.error(
          "Unexpected user classroom status:",
          existingUserClassroom.status
        );
        return NextResponse.json(
          {
            message:
              "An unexpected status was found for this user in the classroom. Please contact support.",
          },
          { status: 500 }
        );
      }
    } else {
      // Pengguna belum memiliki entri di user_classroom, maka buat yang baru
      const { data: insertResult, error: insertError } = await supabase
        .from("user_classroom")
        .insert({
          id_class: classroomData.id,
          email,
          status: 1, // Status awal ketika bergabung
        })
        .select() // Mengambil data yang baru dimasukkan
        .single(); // Harapkan satu baris yang baru dimasukkan

      if (insertError) {
        console.error(
          "Supabase error inserting new user_classroom entry:",
          insertError
        );
        // Pertimbangkan apakah ini error duplikat (unik constraint) vs. error lain
        if (insertError.code === "23505") {
          // PostgreSQL unique violation error code
          return NextResponse.json(
            {
              message:
                "You are already trying to join this classroom. Please refresh.",
            },
            { status: 409 } // 409 Conflict
          );
        }
        return NextResponse.json(
          { error: "Internal Server Error, please try again later." },
          { status: 500 }
        );
      }

      if (!insertResult) {
        // Ini seharusnya tidak terjadi jika insert berhasil tanpa error
        return NextResponse.json(
          { message: "Failed to join classroom. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Class joined successfully!", data: insertResult },
        { status: 200 }
      );
    }
  } catch (error) {
    // Penanganan kesalahan validasi Zod dan JSON parsing
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors); // Log error Zod yang lebih detail
      console.log("Error details:", error.errors[0].message);
      return NextResponse.json(
        { error: "Invalid request data.", details: error.errors },
        { status: 400 }
      );
    }
    console.error(
      "An unexpected error occurred during class join process:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
