import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      return Response.json(
        { error: "Du måste vara inloggad." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const jobTitle = String(body?.jobTitle || "").trim();
    const jobDescription = String(body?.jobDescription || "").trim();
    const cvText = String(body?.cvText || "").trim();

    if (!jobTitle || !jobDescription || !cvText) {
      return Response.json(
        { error: "Jobbtitel, jobbannons och CV krävs." },
        { status: 400 }
      );
    }

    const prompt = `
Du är en expert på jobbintervjuer och coachar kandidaten på svenska.

Utgå från detta CV och denna jobbannons och skapa interview prep.

CV:
${cvText}

Jobb:
Titel: ${jobTitle}
Annons:
${jobDescription}

Returnera svaret på svenska i exakt detta JSON-format:

{
  "questions": [
    {
      "question": "Fråga här",
      "answer": "Ett starkt exempel på svar här"
    }
  ],
  "strengthsToHighlight": [
    "Punkt 1",
    "Punkt 2"
  ],
  "risksToPrepareFor": [
    "Punkt 1",
    "Punkt 2"
  ],
  "finalTips": [
    "Punkt 1",
    "Punkt 2"
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Du är en expert på intervjuförberedelser och svarar endast med giltig JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response.choices[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        { error: "Kunde inte tolka AI-svaret." },
        { status: 500 }
      );
    }

    return Response.json({ prep: parsed });
  } catch (error: any) {
    console.error("INTERVIEW PREP ERROR:", error);
    return Response.json(
      { error: error?.message || "Något gick fel i interview prep." },
      { status: 500 }
    );
  }
}