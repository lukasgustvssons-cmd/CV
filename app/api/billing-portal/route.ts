import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const origin = req.headers.get("origin");

    if (!origin) {
      return NextResponse.json({ error: "Missing origin" }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("clerk_user_id, email, stripe_customer_id")
      .eq("clerk_user_id", userId)
      .single();

    console.log("BILLING PORTAL auth userId:", userId);
    console.log("BILLING PORTAL matched user:", user);
    console.log("BILLING PORTAL query error:", error);

    if (error) {
      return NextResponse.json(
        { error: `Supabase error: ${error.message}` },
        { status: 500 }
      );
    }

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        {
          error: `No Stripe customer found for this user. auth userId=${userId}, db email=${user?.email || "none"}`,
        },
        { status: 400 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("BILLING PORTAL ERROR:", err);

    return NextResponse.json(
      {
        error:
          err?.message ||
          err?.raw?.message ||
          "Could not create billing portal session",
      },
      { status: 500 }
    );
  }
}