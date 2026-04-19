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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_user_id", String(userId))
      .maybeSingle();

    if (userError) {
      return Response.json(
        { error: userError.message || "Failed to fetch user" },
        { status: 500 }
      );
    }

    if (!appUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (appUser.plan !== "career+") {
      return Response.json(
        {
          error: "Upgrade to Career+ to generate a cover letter.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const cvText = String(body?.cvText || "").trim();
    const jobTitle = String(body?.jobTitle || "").trim();
    const company = String(body?.company || "").trim();
    const jobDescription = String(body?.jobDescription || "").trim();
    const lang = body?.lang === "sv" ? "sv" : "en";

    if (!cvText || !jobTitle || !jobDescription) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isSwedish = lang === "sv";

    const systemPrompt = isSwedish
      ? `
Du är expert på att skriva personliga brev för jobbansökningar.

Din uppgift är att skriva ett professionellt, trovärdigt och övertygande personligt brev på svenska baserat på kandidatens CV och den valda jobbannonsen.

Regler:
- Skriv endast på svenska
- Brevet ska kännas mänskligt och professionellt
- Anpassa brevet tydligt till rollen och företaget
- Lyft relevant erfarenhet och motivation från CV:t
- Hitta inte på osannolika erfarenheter eller meriter
- Använd inga markdownsymboler
- Returnera endast själva brevet

Längd:
- cirka 220 till 350 ord
`.trim()
      : `
You are an expert cover letter writer.

Your task is to write a professional, credible, and persuasive cover letter in English based on the candidate's resume and the selected job ad.

Rules:
- Write only in English
- The letter should feel human and professional
- Tailor it clearly to the role and company
- Highlight relevant experience and motivation from the resume
- Do not invent unrealistic experience or credentials
- Do not use markdown symbols
- Return only the letter itself

Length:
- around 220 to 350 words
`.trim();

    const userPrompt = isSwedish
      ? `
Skriv ett personligt brev för detta jobb.

KANDIDATENS CV:
${cvText}

JOBBTITEL:
${jobTitle}

FÖRETAG:
${company}

JOBBANNONS:
${jobDescription}

Mål:
- Gör brevet relevant för rollen
- Visa motivation och tydlig matchning
- Håll tonen professionell och trovärdig
`.trim()
      : `
Write a cover letter for this job.

CANDIDATE RESUME:
${cvText}

JOB TITLE:
${jobTitle}

COMPANY:
${company}

JOB AD:
${jobDescription}

Goals:
- Make the letter relevant to the role
- Show motivation and clear fit
- Keep the tone professional and credible
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error:
            data?.error?.message ||
            (isSwedish
              ? "OpenAI-förfrågan misslyckades."
              : "OpenAI request failed."),
        },
        { status: 500 }
      );
    }

    const output = data?.choices?.[0]?.message?.content?.trim();

    if (!output) {
      return Response.json(
        {
          error: isSwedish
            ? "Kunde inte skapa personligt brev."
            : "Could not generate cover letter.",
        },
        { status: 500 }
      );
    }

    return Response.json({ output });
  } catch (error: any) {
    console.error("COVER LETTER ERROR:", error);

    return Response.json(
      {
        error: error?.message || "Server error in /api/generate-cover-letter",
      },
      { status: 500 }
    );
  }
}
