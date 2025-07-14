import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";
import { z } from "zod";

// Fungsi helper untuk mengonversi string status ke angka status
const convertStatusStringtoNumber = (statusString: string): 1 | 0 | 2 => {
  switch (statusString) {
    case "Hadir":
      return 1;
    case "Alfa":
      return 0;
    case "Ijin":
      return 2;
    default:
      // Jika status string tidak sesuai, lemparkan error
      throw new Error(
        "Status tidak valid. Harus 'Hadir', 'Alfa', atau 'Ijin'."
      );
  }
};
// Schema untuk setiap item di dalam array 'attedance'
const attendanceItemSchema = z.object({
  id: z.string().uuid("ID attendance harus berupa UUID yang valid."), // Memastikan ID adalah UUID
  name: z.string().min(1, "Nama tidak boleh kosong."), // Memastikan nama adalah string dan tidak kosong
  status: z
    .enum(["Hadir", "Ijin", "Alfa"], {
      // Memastikan status adalah salah satu dari nilai yang diizinkan
      errorMap: () => ({
        message: "Status harus 'Hadir', 'Ijin', atau 'Alfa'.",
      }),
    })
    .transform(convertStatusStringtoNumber),
});

// Schema utama untuk seluruh payload data
const PostAttedanceValidationSchema = z.object({
  schedule: z.string().uuid("Schedule ID harus berupa UUID yang valid."), // Memastikan schedule ID adalah UUID
  attedance: z
    .array(attendanceItemSchema)
    .min(1, "Array attendance tidak boleh kosong."), // Memastikan 'attedance' adalah array dan tidak kosong
});



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

    const body = await request.json();

    const validatedData = PostAttedanceValidationSchema.parse(body);

    const { schedule, attedance } = validatedData;

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
    const userClassroomIdClass = userClassroomData.id_class;

    //cek schedule
    const { data: scheduleData, error: scheduleDataError } = await supabase
      .from("schedule")
      .select("id")
      .eq("id", schedule)
      .eq("id_class", userClassroomIdClass)
      .in("status", [1])
      .single();

    // Periksa apakah ada error DAN itu BUKAN error "tidak ditemukan baris" (PGRST116)
    if (scheduleDataError && scheduleDataError.code !== "PGRST116") {
      console.error(
        "Supabase error fetching classroom data:",
        scheduleDataError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    if (!scheduleData) {
      return NextResponse.json(
        {
          message: "Schedule record not found or user not authorized/owner.",
        },
        { status: 404 }
      );
    }

    // --- Pengecekan Keberadaan ID Siswa dalam Array attedance ---
    const studentIds = attedance.map((item) => item.id); // Ambil semua ID siswa dari array
    if (studentIds.length === 0) {
      return NextResponse.json(
        {
          message: "Tidak ada siswa yang disertakan dalam data kehadiran.",
        },
        { status: 400 }
      );
    }

    const { data: existingStudents, error: studentError } = await supabase
      .from("students") // Ganti dengan nama tabel siswa Anda (misal: 'users', 'members')
      .select("id")
      .eq("id_class", userClassroomIdClass)
      .eq("status", 1)
      .in("id", studentIds); // Menggunakan .in() untuk mencari banyak ID sekaligus

    if (studentError) {
      console.error("Error saat mencari siswa absensi :", studentError);
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    // Buat Set dari ID siswa yang ada di database untuk lookup cepat
    const existingStudentIds = new Set(
      existingStudents.map((student) => student.id)
    );

    const nonExistingStudents: string[] = [];
    for (const studentId of studentIds) {
      if (!existingStudentIds.has(studentId)) {
        nonExistingStudents.push(studentId);
      }
    }

    if (nonExistingStudents.length > 0) {
      return NextResponse.json(
        {
          message: "Beberapa ID siswa tidak ditemukan.",
          nonExistingIds: nonExistingStudents,
        },
        { status: 404 }
      );
    }

    // --- Membuat data attedance terlebih dahulu ---
    const { data: attendanceInsertData, error: attendanceInsertError } =
      await supabase
        .from("attedance") // Ganti dengan nama tabel kehadiran Anda
        .insert({
          id_class: userClassroomIdClass,
          id_user: idClassCurrent,
          id_schedule: schedule,
        })
        .select();

    if (attendanceInsertError) {
      console.error(
        "Supabase error during attendanceInsertData:",
        attendanceInsertError
      );
      return NextResponse.json(
        {
          error: "Internal Server Error, Please Try Again Later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    if (!attendanceInsertData || attendanceInsertData.length === 0) {
      return NextResponse.json(
        { message: "attendanceData record to Create not found." },
        { status: 404 }
      );
    }

    const attedanceID = attendanceInsertData[0].id;

    // --- Jika semua validasi berhasil, lanjutkan dengan insert data Absensi---

    const { data: absensiData, error: absensiDataError } = await supabase
      .from("absensi") // Ganti dengan nama tabel kehadiran Anda
      .insert(
        attedance.map((item) => ({
          id_attedance: attedanceID,
          id_student: item.id,
          status: item.status, // Sudah diubah oleh Zod ke angka (0, 1, 2)
        }))
      )
      .select();

    if (absensiDataError) {
      console.error("Gagal menyimpan kehadiran:", absensiDataError);
      return NextResponse.json(
        {
          error: "Internal Server Error, Please Try Again Later.",
          referenceId: idClassCurrent,
        },
        { status: 500 }
      );
    }

    if (!absensiData || absensiData.length === 0) {
      return NextResponse.json(
        { message: "absensiData record to Create not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Success",
        attedance: attedanceID,
        absensi: absensiData,
      },
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

    // Ambil ID Attedance dari request
    const { idAttedance } = await request.json();

    if (!z.string().uuid().safeParse(idAttedance).success) {
      return NextResponse.json(
        { error: "Invalid ID Attedance" },
        { status: 400 }
      );
    }

    if (!idAttedance)
      return NextResponse.json(
        {
          error:
            "Bad Request: idAttedance is missing in the request body.",
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
      .from("attedance")
      .update({ is_deleted: true })
      .eq("id_class", classroomIdToUpdate)
      .eq("id", idAttedance)
      .eq("id_user", classroomId)
      .eq("is_deleted", false)
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
        { message: "Attedance record to delete not found." },
        { status: 404 }
      );
    }

    // Success Response
    const messageJson = `${email} delete Attedance with Id attedance ${idAttedance} successfully.`;
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

