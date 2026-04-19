import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

function getFileExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "jpg" : "jpg";
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return Response.json(
        { error: "Supabase-miljövariabler saknas." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return Response.json({ error: "Ingen bild skickades med." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "Filen måste vara en bild." }, { status: 400 });
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return Response.json(
        { error: "Bilden är för stor. Max 5 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extension = getFileExtension(file.name);
    const safeName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
    const filePath = `public/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("cv-photos")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return Response.json(
        { error: uploadError.message || "Kunde inte ladda upp bilden." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("cv-photos")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      return Response.json(
        { error: "Kunde inte hämta publik bild-URL." },
        { status: 500 }
      );
    }

    return Response.json({
      url: publicUrl,
      path: filePath,
    });
  } catch (error: any) {
    console.error("UPLOAD PHOTO ERROR:", error);

    return Response.json(
      {
        error:
          error?.message || error?.toString() || "Server error in /api/upload-photo",
      },
      { status: 500 }
    );
  }
}
