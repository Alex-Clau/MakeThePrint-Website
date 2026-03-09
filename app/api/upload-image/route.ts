import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const BUCKET_NAME = "product-images";

export async function POST(request: Request) {
  try {
    // Ensure the caller is an authenticated admin
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nu ești autentificat." },
        { status: 401 },
      );
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: "Nu ai permisiunea să faci această acțiune." },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const filename = formData.get("filename");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Nu a fost trimis niciun fișier." },
        { status: 400 },
      );
    }

    if (typeof filename !== "string" || !filename.trim()) {
      return NextResponse.json(
        { error: "Numele fișierului lipsește." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Fișierul este prea mare. Dimensiunea maximă acceptată este 10MB." },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Tip de fișier invalid. Te rugăm să încarci doar imagini." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = "webp";
    const safeName = filename
      .toLowerCase()
      .replace(/[^a-z0-9\-_.]/g, "-")
      .replace(/-+/g, "-");

    const path = `products/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}-${safeName}.${ext}`;

    const adminClient = createAdminClient();
    const { error: uploadError } = await adminClient.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        contentType: file.type || "image/webp",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error:
            uploadError.message ||
            "Încărcarea imaginii a eșuat. Te rugăm să încerci din nou.",
        },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = adminClient.storage.from(BUCKET_NAME).getPublicUrl(path);

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Nu am putut genera un link public pentru această imagine." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Eroare în /api/upload-image:", error);
    return NextResponse.json(
      {
        error: "Eroare internă de server. Te rugăm să încerci din nou.",
      },
      { status: 500 },
    );
  }
}

