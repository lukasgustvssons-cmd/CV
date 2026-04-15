import { auth, clerkClient } from "@clerk/nextjs/server";
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
    const { experience, job, lang } = await req.json();

    const isSwedish = lang === "sv";

    if (!experience || !job) {
      return Response.json({
        output: isSwedish
          ? "Fyll i båda fälten."
          : "Please fill in both fields.",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        output: isSwedish
          ? "OPENAI_API_KEY saknas i .env.local"
          : "Missing OPENAI_API_KEY in .env.local",
      });
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return Response.json({
        output: isSwedish
          ? "Supabase-miljövariabler saknas."
          : "Missing Supabase environment variables.",
      });
    }

    let appUser: any = null;
    let email: string | null = null;

    if (userId) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;

      const { data: existingUser, error: fetchUserError } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_user_id", String(userId))
        .maybeSingle();

      if (fetchUserError) {
        return Response.json({
          output:
            fetchUserError.message ||
            (isSwedish
              ? "Databasfel vid hämtning av användare."
              : "Database error while fetching user."),
        });
      }

      appUser = existingUser;

      if (!appUser) {
        const defaultPlan = "free";

        const { data: insertedUser, error: insertUserError } = await supabase
          .from("users")
          .insert({
            clerk_user_id: String(userId),
            email,
            plan: defaultPlan,
            credits_used: 0,
          })
          .select("*")
          .single();

        if (insertUserError) {
          return Response.json({
            output:
              insertUserError.message ||
              (isSwedish
                ? "Databasfel vid skapande av användare."
                : "Database error while creating user."),
          });
        }

        appUser = insertedUser;
      }
    }

    const systemPrompt = isSwedish
      ? `
Du är en CV-expert på elitnivå och en erfaren karriärcoach.

Din uppgift är att skriva ett professionellt, trovärdigt och starkt CV på svenska baserat på kandidatens erfarenhet och målrollen.

Mål:
- CV:t ska kännas mänskligt skrivet
- Det ska vara tydligt anpassat till rollen
- Det ska låta professionellt, relevant och anställningsbart
- Det ska lyfta kandidatens styrkor utan att hitta på osannolika detaljer

Viktiga regler:
- Skriv endast på svenska
- Skriv aldrig att texten är AI-genererad
- Använd inte markdownsymboler
- Använd inte platshållare som [Namn], [Telefon], [Email]
- Hitta inte på företag, examen eller certifikat om det inte stöds av input
- Du får förbättra formulering, struktur och språk kraftigt
- Du får dra rimliga slutsatser från kandidatens input
- Om erfarenheten är begränsad, skriv starkt men realistiskt
- Undvik generiska buzzwords och tomma fraser
- Gör innehållet konkret, professionellt och ATS-vänligt

Format:
Svara endast med själva CV-texten.

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
Använd 1 till 2 roller beroende på input.
Om exakt rolltitel är oklar, använd en neutral men trovärdig titel baserad på erfarenheten.
För varje roll:
Rolltitel
Kort förklarande rad om det behövs
- 3 till 5 starka punktlistor med ansvar, resultat eller relevant värde

Utbildning
Kort sektion.
Om utbildning inte nämns, skriv:
Relevant utbildningsbakgrund eller motsvarande praktisk erfarenhet
`.trim()
      : `
You are an elite resume writer and experienced career coach.

Your task is to write a polished, credible, professional resume in English based on the candidate's background and target role.

Goals:
- The resume must feel human-written
- It must be clearly tailored to the role
- It must sound polished, relevant, and hireable
- It should highlight strengths without inventing unrealistic facts

Important rules:
- Write only in English
- Never mention AI
- Do not use markdown symbols
- Do not use placeholders like [Your Name], [Phone], [Email]
- Do not invent employers, degrees, or certifications unless supported by the input
- You may significantly improve wording, structure, and positioning
- You may make reasonable inferences from the candidate's background
- If the experience is limited, make it strong but realistic
- Avoid generic buzzwords and filler
- Make the content concrete, ATS-friendly, and professional

Output:
Return only the resume text.

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
Include 1 to 2 roles depending on the input.
If the exact title is unclear, use a neutral but credible title based on the candidate's background.
For each role:
Job Title
Optional one-line context if useful
- 3 to 5 strong bullet points

Education
Short section.
If no education is provided, write:
Relevant academic background or equivalent practical experience
`.trim();

    const userPrompt = isSwedish
      ? `
Skriv ett professionellt CV på svenska utifrån informationen nedan.

Kandidatens erfarenhet:
${experience}

Målroll:
${job}

Extra instruktioner:
- Anpassa sammanfattning och kompetenser tydligt efter målrollen
- Lyft överförbara styrkor om kandidaten byter bransch eller har begränsad erfarenhet
- Prioritera tydlighet, professionalism och relevans
- Punktlistor ska vara skarpa och konkreta
- Om målrollen innehåller viktiga nyckelord, väv in dem naturligt där det passar
- Håll texten ren och snygg så den fungerar bra i PDF
`.trim()
      : `
Write a professional resume in English based on the information below.

Candidate background:
${experience}

Target role:
${job}

Additional instructions:
- Tailor the summary and competencies clearly to the target role
- Highlight transferable strengths if the candidate is changing fields or has limited experience
- Prioritize clarity, professionalism, and relevance
- Bullet points should feel sharp and concrete
- If the target role includes important keywords, incorporate them naturally where appropriate
- Keep the formatting clean so it looks strong in PDF
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
      return Response.json({
        output:
          data?.error?.message ||
          (isSwedish
            ? "OpenAI-förfrågan misslyckades."
            : "OpenAI request failed."),
      });
    }

    const output = data?.choices?.[0]?.message?.content?.trim();

    if (!output) {
      return Response.json({
        output: isSwedish
          ? "Kunde inte skapa CV. Försök skriva lite mer detaljer."
          : "Could not generate resume. Try adding a bit more detail.",
      });
    }

    if (userId && appUser) {
      const { error: updateCreditsError } = await supabase
        .from("users")
        .update({ credits_used: (appUser?.credits_used || 0) + 1 })
        .eq("clerk_user_id", String(userId));

      if (updateCreditsError) {
        return Response.json({
          output:
            updateCreditsError.message ||
            (isSwedish
              ? "CV:t skapades, men statistiken kunde inte uppdateras."
              : "The resume was created, but statistics could not be updated."),
        });
      }
    }

    return Response.json({ output });
  } catch (error: any) {
    console.error("FULL ROUTE ERROR:", error);

    return Response.json({
      output:
        error?.message ||
        error?.toString() ||
        "Server error in /api/generate",
    });
  }
}