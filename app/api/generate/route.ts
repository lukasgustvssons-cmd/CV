import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
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
    const { experience, job, lang, location } = await req.json();

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

    const cookieStore = await cookies();

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

      const isFree = appUser.plan === "free";

      if (isFree && (appUser.credits_used || 0) >= 1) {
        return Response.json({
          output: isSwedish
            ? "Du har nått gränsen för gratis användning. Uppgradera för att skapa fler CV."
            : "You have reached the free limit. Upgrade to create more resumes.",
          limitReached: true,
        });
      }
    } else {
      const guestCvCreated = cookieStore.get("hireon_guest_cv_created");

      if (guestCvCreated?.value === "true") {
        return Response.json(
          {
            output: isSwedish
              ? "Du har redan skapat ett gratis CV. Skapa konto för att fortsätta."
              : "You have already created one free resume. Create an account to continue.",
            limitReached: true,
          },
          { status: 403 }
        );
      }
    }

    const systemPrompt = isSwedish
      ? `
Du är en senior CV-expert, karriärcoach och specialist på svenska jobbansökningar.

Din uppgift är att skriva ett starkt, trovärdigt och professionellt CV på svenska baserat på kandidatens erfarenhet och målrollen.

CV:t kommer att visas i ett designat template med:
- namn överst
- yrkestitel under namnet
- profilsektion
- kompetenser
- arbetslivserfarenhet
- utbildning
- kontaktuppgifter om de finns

Därför måste strukturen vara ren, tydlig och konsekvent.

Mål:
- CV:t ska kännas mänskligt skrivet
- Det ska vara tydligt anpassat till målrollen
- Det ska låta professionellt, relevant och anställningsbart
- Det ska fungera bra både visuellt och ATS-mässigt
- Det ska lyfta kandidatens styrkor utan att hitta på osannolika detaljer

Viktiga regler:
- Skriv endast på svenska
- Skriv aldrig att texten är AI-genererad
- Använd inte markdownsymboler som ** eller ##
- Använd inte platshållare som [Namn], [Telefon], [Email]
- Hitta inte på företag, examen eller certifikat om det inte stöds av input
- Du får förbättra språk, struktur och formulering kraftigt
- Du får dra rimliga slutsatser från kandidatens input
- Om erfarenheten är begränsad, skriv starkt men realistiskt
- Undvik generiska buzzwords och tomma fraser
- Var konkret, professionell och tydlig
- Håll varje sektion ren och lättläst
- Punktlistor ska vara korta, konkreta och starka
- Undvik långa stycken i arbetslivserfarenhet
- Om kandidatens namn eller kontaktuppgifter inte framgår, lämna dem ute helt
- Om exakt rolltitel är oklar, välj en neutral men trovärdig yrkestitel baserat på erfarenheten
- Om utbildning saknas, skriv en kort realistisk rad om relevant bakgrund eller motsvarande praktisk erfarenhet

Returnera endast själva CV-texten.

Använd EXAKT denna struktur och ordning:

Första raden:
Kandidatens namn endast om det tydligt finns i input. Om namn inte finns, skriv inget namn.

Andra raden:
En kort yrkestitel i versaler, till exempel:
IT-PROJEKTLEDARE
MARKNADSKOORDINATOR
BUTIKSMEDARBETARE

Om kontaktuppgifter tydligt finns i input, skriv dem på egna rader direkt efter titeln:
telefonnummer
e-postadress

Tom rad

Professionell sammanfattning
Skriv 3 till 4 meningar som känns specifika, trovärdiga och anpassade till rollen.

Tom rad

Kompetenser
- 5 till 8 konkreta kompetenser
- Kompetenserna ska vara korta och fungera bra i punktlista
- Om certifikat tydligt finns i input kan de blandas in här som egna punkter

Tom rad

Arbetslivserfarenhet
Inkludera 1 till 3 roller beroende på input.

För varje roll, använd exakt detta upplägg:
Rolltitel
Arbetsgivare | datum eller tidsperiod om det finns
- konkret punkt
- konkret punkt
- konkret punkt

Tom rad mellan rollerna.

Tom rad

Utbildning
Kort sektion.

För varje utbildning:
Skola eller utbildning
Examen / inriktning eller kort förklarande rad
- kort relevant punkt om det behövs

Viktigt:
- Sektionsrubrikerna måste vara exakt:
Professionell sammanfattning
Kompetenser
Arbetslivserfarenhet
Utbildning
`.trim()
      : `
You are a senior resume writer, career coach, and specialist in high-quality job application materials.

Your task is to write a strong, credible, professional resume in English based on the candidate's background and target role.

The resume will be shown inside a visual template with:
- name at the top
- role title under the name
- profile section
- skills
- professional experience
- education
- contact details if available

So the structure must be clean, clear, and consistent.

Goals:
- The resume must feel human-written
- It must be clearly tailored to the target role
- It must sound polished, relevant, and hireable
- It must work well visually and for ATS
- It should highlight strengths without inventing unrealistic facts

Important rules:
- Write only in English
- Never mention AI
- Do not use markdown symbols like ** or ##
- Do not use placeholders such as [Name], [Phone], [Email]
- Do not invent employers, degrees, or certifications unless supported by the input
- You may significantly improve wording, structure, and positioning
- You may make reasonable inferences from the candidate's background
- If the experience is limited, make it strong but realistic
- Avoid generic buzzwords and filler
- Be concrete, professional, and clear
- Keep each section easy to read
- Bullet points must be concise and impactful
- Avoid long paragraphs in experience
- If the candidate's name or contact details are not provided, leave them out entirely
- If the exact job title is unclear, choose a neutral but credible title based on the background
- If education is missing, write a short realistic line about relevant academic background or equivalent practical experience

Return only the resume text.

Use EXACTLY this structure and order:

First line:
Candidate name only if clearly present in the input. If no name is present, write nothing for the name.

Second line:
A short uppercase role title, for example:
PROJECT COORDINATOR
SOFTWARE DEVELOPER
CUSTOMER SERVICE REPRESENTATIVE

If contact details are clearly present in the input, write them on separate lines directly after the title:
phone number
email address

Blank line

Professional Summary
Write 3 to 4 sentences that feel specific, credible, and tailored to the role.

Blank line

Core Competencies
- 5 to 8 concrete skills
- Skills must be short and work well in bullet format
- If certifications are clearly present in the input, they may appear here as their own bullets

Blank line

Professional Experience
Include 1 to 3 roles depending on the input.

For each role, use exactly this format:
Job Title
Employer | dates or time period if available
- concrete bullet
- concrete bullet
- concrete bullet

Blank line between roles.

Blank line

Education
Short section.

For each education entry:
School or education provider
Degree / specialization or short clarifying line
- short relevant bullet if needed

Important:
- Section headings must be exactly:
Professional Summary
Core Competencies
Professional Experience
Education
`.trim();

    const userPrompt = isSwedish
      ? `
Skriv ett professionellt CV på svenska utifrån informationen nedan.

Kandidatens erfarenhet:
${experience}

Målroll:
${job}

Plats:
${location || "Ej angiven"}

Extra instruktioner:
- Anpassa sammanfattning och kompetenser tydligt efter målrollen
- Lyft överförbara styrkor om kandidaten byter bransch eller har begränsad erfarenhet
- Prioritera tydlighet, professionalism och relevans
- Punktlistor ska vara skarpa, konkreta och korta
- Om målrollen innehåller viktiga nyckelord, väv in dem naturligt där det passar
- CV:t ska fungera bra i ett modernt, designat CV-template
- Skriv inte för långa textblock
- Om kandidaten verkar vara junior, skriv starkt men realistiskt
- Om namn, telefon eller e-post finns i input får du använda dem
- Om de inte finns, lämna dem ute
`.trim()
      : `
Write a professional resume in English based on the information below.

Candidate background:
${experience}

Target role:
${job}

Location:
${location || "Not provided"}

Additional instructions:
- Tailor the summary and competencies clearly to the target role
- Highlight transferable strengths if the candidate is changing fields or has limited experience
- Prioritize clarity, professionalism, and relevance
- Bullet points should be concise, sharp, and concrete
- If the target role includes important keywords, incorporate them naturally where appropriate
- The resume should work well inside a modern visual template
- Avoid overly long text blocks
- If the candidate seems junior, write strongly but realistically
- If name, phone, or email are present in the input, you may use them
- If they are not present, leave them out
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.6,
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

    if (!userId) {
      cookieStore.set("hireon_guest_cv_created", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
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