import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    if (!jobTitle || !jobDescription) {
      return Response.json(
        { error: "Jobbtitel och jobbannons krävs." },
        { status: 400 }
      );
    }

    const prompt = `
Du är en svensk karriärcoach och intervjucoach.

Din uppgift är att skapa en intervjuförberedelse på svenska baserat på ett jobb som användaren har sparat.
Frågorna ska vara realistiska och sannolika utifrån jobbannonsen, men du måste vara tydlig med att detta inte är de riktiga intervjufrågorna utan övningsfrågor som troligen liknar sådana arbetsgivaren kan ställa.

Utgå främst från jobbannonsen. Om CV-text finns, använd den för att anpassa tipsen.

Jobbtitel:
${jobTitle}

Jobbannons:
${jobDescription}

CV:
${cvText || "Inget CV skickades med."}

Returnera endast giltig JSON i exakt detta format:

{
  "disclaimer": "Kort svensk text som förklarar att detta inte är de riktiga frågorna utan AI-genererade övningsfrågor baserade på jobbet.",
  "intro": "Kort svensk introduktion till användaren.",
  "questions": [
    {
      "question": "En sannolik intervjufråga på svenska",
      "whyThisMatters": "Kort förklaring varför arbetsgivaren kan ställa denna fråga",
      "answerTip": "Kort tips på hur användaren kan tänka när den svarar"
    }
  ],
  "thingsToHighlight": [
    "Punkt 1",
    "Punkt 2"
  ],
  "thingsToPrepare": [
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
            "Du är en intervjucoach. Du svarar endast med giltig JSON.",
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
      { error: error?.message || "Något gick fel i intervjuförberedelsen." },
      { status: 500 }
    );
  }
}