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
          error: "Upgrade to Career+ to improve your CV for a selected job.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const currentCv = String(body?.currentCv || "").trim();
    const jobTitle = String(body?.jobTitle || "").trim();
    const company = String(body?.company || "").trim();
    const location = String(body?.location || "").trim();
    const jobDescription = String(body?.jobDescription || "").trim();
    const lang = body?.lang === "sv" ? "sv" : "en";

    if (!currentCv || !jobTitle || !jobDescription) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const isSwedish = lang === "sv";

    const systemPrompt = isSwedish
      ? `
Du är en expert på CV-optimering.

Din uppgift är att förbättra ett befintligt CV så att det matchar en specifik jobbannons bättre, utan att hitta på orimliga erfarenheter.

Regler:
- Skriv endast på svenska
- Behåll ett professionellt, trovärdigt och mänskligt språk
- Hitta inte på arbetsgivare, utbildningar eller certifikat
- Förstärk relevanta och överförbara delar från kandidatens nuvarande CV
- Anpassa sammanfattning, kompetenser och erfarenhet tydligare mot jobbet
- Använd inga markdownsymboler
- Returnera endast själva CV-texten

Använd exakt denna struktur:

Professionell sammanfattning
3 till 4 meningar

Nyckelkompetenser
- punkt
- punkt
- punkt
- punkt
- punkt
- punkt

Arbetslivserfarenhet
1 till 2 roller
För varje roll:
Rolltitel
Kort rad om det behövs
- 3 till 5 punktlistor

Utbildning
Kort sektion
`.trim()
      : `
You are an expert resume optimizer.

Your task is to improve an existing resume so it matches a specific job ad better, without inventing unrealistic experience.

Rules:
- Write only in English
- Keep the language professional, credible, and human
- Do not invent employers, education, or certifications
- Strengthen relevant and transferable parts from the candidate's existing resume
- Tailor the summary, skills, and experience more clearly to the job
- Do not use markdown symbols
- Return only the resume text

Use exactly this structure:

Professional Summary
3 to 4 sentences

Core Competencies
- bullet
- bullet
- bullet
- bullet
- bullet
- bullet

Professional Experience
1 to 2 roles
For each role:
Job Title
Optional one-line context
- 3 to 5 bullet points

Education
Short section
`.trim();

    const userPrompt = isSwedish
      ? `
Förbättra detta CV så att det passar jobbet bättre.

NUVARANDE CV:
${currentCv}

JOBBTITEL:
${jobTitle}

FÖRETAG:
${company}

PLATS:
${location}

JOBBANNONS:
${jobDescription}

Mål:
- Gör CV:t mer relevant för jobbet
- Lyft rätt styrkor och nyckelord
- Behåll det trovärdigt
- Förbättra matchningen tydligt utan att överdriva
`.trim()
      : `
Improve this resume so it fits the job better.

CURRENT RESUME:
${currentCv}

JOB TITLE:
${jobTitle}

COMPANY:
${company}

LOCATION:
${location}

JOB AD:
${jobDescription}

Goals:
- Make the resume more relevant for the job
- Highlight the right strengths and keywords
- Keep it credible
- Improve the match clearly without exaggerating
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.5,
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
            ? "Kunde inte förbättra CV:t."
            : "Could not improve the resume.",
        },
        { status: 500 }
      );
    }

    return Response.json({ output });
  } catch (error: any) {
    console.error("IMPROVE CV ERROR:", error);

    return Response.json(
      {
        error: error?.message || "Server error in /api/improve-cv",
      },
      { status: 500 }
    );
  }
}