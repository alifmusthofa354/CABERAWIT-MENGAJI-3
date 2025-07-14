import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

const IDPatchAttedanceValidationSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID User Classroom" }),
  idAbsensi: z.string().uuid({ message: "Invalid ID Absensi" }),
});

// Definisikan skema untuk body permintaan
const statusSchema = z.object({
  // Menggunakan z.union untuk memastikan Status adalah salah satu dari literal 0, 1, atau 2
  Status: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2)
  ], {
    // Pesan error kustom jika Status bukan salah satu dari 0, 1, atau 2
    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.invalid_union) {
        return { message: "Status harus berupa 0 (Alfa), 1 (Hadir), atau 2 (Izin/Sakit)." };
      }
      return { message: ctx.defaultError };
    },
  })
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, idStudent: string }> }
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
    const validatedParams = IDPatchAttedanceValidationSchema.parse(await params);
    const { id, idAbsensi } = validatedParams;
    const classroomId = id

    idClassCurrent = classroomId;
    const email = session.user.email;

    // Ambil Status dari body request
    const body = await request.json();
    const validatedBody = statusSchema.parse(body);
    const { Status } = validatedBody;

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

    // --- Langkah 2: Panggil Stored Procedure untuk memverifikasi dan mengupdate ---
    // Meneruskan userClassroomData.id_class sebagai p_user_classroom_expected_class_id
    const { data: funcResult, error: funcError } = await supabase
      .rpc('update_absensi_status_and_get_class_id', {
        p_id_absensi: idAbsensi,
        p_new_status: Status,
        p_user_classroom_expected_class_id: userClassroomData.id_class // <-- Parameter baru
      });

    // Penanganan error dari Stored Procedure
    if (funcError) {
        console.error("Supabase RPC error calling update_absensi_status_and_get_class_id:", funcError);
        let status = 500;
        let message = "Internal Server Error, Please Try Again Later.";

        if (funcError.message.includes("Absensi record with ID") && funcError.message.includes("not found")) {
            status = 404;
            message = "Record absensi tidak ditemukan.";
        } else if (funcError.message.includes("Related attedance record") && funcError.message.includes("not found")) {
            status = 404;
            message = "Record kehadiran terkait tidak ditemukan.";
        } else if (funcError.message.includes("Related attedance record") && funcError.message.includes("is deleted")) {
            status = 403; // Forbidden, karena record sudah dihapus
            message = "Operasi tidak diizinkan. Record kehadiran terkait telah dihapus.";
        } else if (funcError.message.includes("Classroom ID mismatch")) { // <-- Tangani error mismatch baru
            status = 403; // Forbidden
            message = "Akses Ditolak. Anda tidak memiliki izin untuk memodifikasi absensi di kelas ini.";
        }

        return NextResponse.json(
            { error: message, referenceId: idClassCurrent },
            { status: status }
        );
    }

    // Jika funcResult kosong atau tidak ada data yang kembali (seharusnya tidak jika tidak ada error)
    if (!funcResult || funcResult.length === 0) {
        return NextResponse.json(
            { error: "Stored procedure returned no data or failed silently." },
            { status: 500 }
        );
    }

    // Sekarang, semua validasi telah dilakukan di database.
    const { absensi_id, absensi_status, attedance_class_id } = funcResult[0];

    // Success Response
    const messageJson = `${email} update Absensi with Id : ${absensi_id} successfully.`;
    return NextResponse.json(
      {
        message: messageJson,
        absensi: { id: absensi_id, status: absensi_status },
        attedanceClassId: attedance_class_id
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