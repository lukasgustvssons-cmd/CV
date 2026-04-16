import { auth } from "@clerk/nextjs/server";
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

const ALLOWED_STATUSES = ["saved", "applied", "interview", "rejected"] as const;

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return Response.json(
        { error: "Missing id or status" },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      return Response.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // hämta item (säkerhet: bara userns egna)
    const { data: item, error: fetchError } = await supabase
      .from("saved_items")
      .select("*")
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .single();

    if (fetchError || !item) {
      return Response.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    if (item.type !== "job") {
      return Response.json(
        { error: "Only jobs can have status" },
        { status: 400 }
      );
    }

    const updatedMeta = {
      ...(item.meta || {}),
      status,
    };

    const { data, error } = await supabase
      .from("saved_items")
      .update({ meta: updatedMeta })
      .eq("id", id)
      .eq("clerk_user_id", userId)
      .select()
      .single();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({ item: data });
  } catch (err: any) {
    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}