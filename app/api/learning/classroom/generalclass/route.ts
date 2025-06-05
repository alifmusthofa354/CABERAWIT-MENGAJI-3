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
    .min(1, { message: "descriptionn is required" })
    .max(255, { message: "description max 255" })
    .optional(),
  waGrup: z.string().min(1, { message: "waGrup is required" }).optional(),
});

// Fungsi untuk menangani upload file menggunakan formidable (Promise-based)
async function parseFormData(req: Request): Promise<{
  fields: Record<string, string>;
  files: Record<string, File | File[]>;
}> {
  return new Promise(async (resolve) => {
    const formData = await req.formData();
    const fields: Record<string, string> = {};
    const files: Record<string, File | File[]> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        fields[key] = value;
      } else if (value instanceof File) {
        if (files[key]) {
          if (!Array.isArray(files[key])) {
            files[key] = [files[key]];
          }
          (files[key] as File[]).push(value);
        } else {
          files[key] = value;
        }
      }
    }
    resolve({ fields, files });
  });
}

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

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;
  const idUserClassroom = request.nextUrl.searchParams.get("id");

  try {
    let query = supabase
      .from("user_classroom")
      .select(
        `id, isOwner, classroom( name, description, image_url,kode,link_wa,status)`
      )
      .eq("email", email)
      .gte("status", 0) // Adding condition for user_classroom.status >= 0
      .gte("classroom.status", 0)
      .lt("classroom.status", 2)
      .not("classroom", "is", null);

    if (idUserClassroom) {
      query = query.eq("id", idUserClassroom);
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
      if (idUserClassroom) {
        // Jika ada idUserClassroom tapi tidak ada data, berarti ID tidak ditemukan
        return NextResponse.json(
          {
            message: `Classroom with ID '${idUserClassroom}' not found for this user, or it's not active.`,
          },
          { status: 404 }
        );
      } else {
        // Jika tidak ada idUserClassroom dan data kosong, berarti user belum punya kelas
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

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized or email not found" },
      { status: 401 }
    );
  }

  const email = session.user.email;

  try {
    const { fields, files } = await parseFormData(req);

    // Validasi data teks menggunakan Zod
    const validatedFields = classSchema.parse(fields);
    const { name, description, waGrup } = validatedFields;

    let imageUrl: string | null = null;
    if (files?.image) {
      const imageFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;
      imageUrl = await uploadImageToSupabase(imageFile);
      if (!imageUrl) {
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // const { data, error } = await supabase
    //   .from("classroom")
    //   .insert([{ name, description, image_url: imageUrl }]) // Simpan URL gambar
    //   .select("*");

    const { data, error } = await supabase.rpc("create_classroom", {
      p_name: name,
      p_description: description,
      p_image_url: imageUrl,
      p_link_wa: waGrup,
      p_email: email,
    });

    if (error) {
      console.error("Supabase error during class creation:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Class created successfully", id: data },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Zod validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("General error during class creation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating the class" },
      { status: 500 }
    );
  }
}
