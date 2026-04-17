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

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return Response.json({ error: "Missing item id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("id", id)
      .eq("clerk_user_id", String(userId));

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      { error: error?.message || "Server error while deleting item." },
      { status: 500 }
    );
  }
}