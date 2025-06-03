import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;
  const classroomId = request.nextUrl.searchParams.get("id");

  try {
    let query = supabase
      .from("user_classroom")
      .select(
        `id, id_class, email, isOwner, status, classroom(id, name, description, image_url,kode,link_wa,status)`
      )
      .eq("email", email)
      .gte("status", 0) // Adding condition for user_classroom.status >= 0
      .gte("classroom.status", 0)
      .lt("classroom.status", 2)
      .not("classroom", "is", null);

    if (classroomId) {
      query = query.eq("id", classroomId);
    } else {
      query = query.order("created_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database Error : ", { error: error.message });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // --- 6. Penanganan Data Tidak Ditemukan/Kosong ---
    if (!data || data.length === 0) {
      if (classroomId) {
        // Jika ada classroomId tapi tidak ada data, berarti ID tidak ditemukan
        return NextResponse.json(
          {
            message: `Classroom with ID '${classroomId}' not found for this user, or it's not active.`,
          },
          { status: 404 }
        );
      } else {
        // Jika tidak ada classroomId dan data kosong, berarti user belum punya kelas
        // Ini adalah respons sukses (200 OK) tapi dengan data kosong

        return NextResponse.json(
          { classes: data },
          { status: 200 } // Mengembalikan 200 OK karena permintaan berhasil diproses
        );
      }
    }

    return NextResponse.json({ classes: data });
  } catch (error) {
    console.error("System Error while fething general classrrom : ", error);
    return NextResponse.json(
      { error: "System Error while fething general classrrom" },
      { status: 500 }
    );
  }
}
