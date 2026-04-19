import Stripe from "stripe";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(secretKey);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { priceId, plan } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    if (!plan || !["pro", "career+"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const origin = req.headers.get("origin");

    if (!origin) {
      return NextResponse.json({ error: "Missing origin" }, { status: 400 });
    }

    // 🔥 KOLLA om user redan har Stripe customer
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id, email")
      .eq("clerk_user_id", userId)
      .single();

    let customerId = userData?.stripe_customer_id || null;

    // 🔥 Skapa customer om det inte finns
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData?.email || undefined,
        metadata: {
          clerk_user_id: userId,
        },
      });

      customerId = customer.id;

      // spara direkt i DB
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("clerk_user_id", userId);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId, // 🔥 SUPER VIKTIG

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${origin}/success`,
      cancel_url: `${origin}/pricing`,

      metadata: {
        clerk_user_id: userId,
        plan: plan,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "No checkout URL returned from Stripe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("STRIPE CHECKOUT ERROR:", err);

    return NextResponse.json(
      {
        error:
          err?.message ||
          err?.raw?.message ||
          "Stripe checkout failed",
      },
      { status: 500 }
    );
  }
}