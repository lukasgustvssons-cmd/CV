import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Du måste vara inloggad för att spara." },
        { status: 401 }
      );
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return Response.json(
        { error: "Supabase-miljövariabler saknas." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const body = await req.json();

    const type = String(body?.type || "").trim();
    const title = String(body?.title || "").trim();
    const content = String(body?.content || "").trim();
    const rawMeta = body?.meta ?? {};

    const meta =
      type === "job"
        ? {
            ...rawMeta,
            status: rawMeta?.status || "saved",
          }
        : rawMeta;

    if (!type || !title) {
      return Response.json(
        { error: "Typ och titel krävs." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("saved_items")
      .insert({
        clerk_user_id: userId,
        type,
        title,
        content,
        meta,
      })
      .select("*")
      .single();

    if (error) {
      return Response.json(
        { error: error.message || "Kunde inte spara." },
        { status: 500 }
      );
    }

    return Response.json({ item: data });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Serverfel i /api/save-item" },
      { status: 500 }
    );
  }
}