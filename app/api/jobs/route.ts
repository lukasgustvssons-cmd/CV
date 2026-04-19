import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type RawAfJob = {
  id?: string;
  headline?: string;
  employer?: {
    name?: string;
  };
  workplace_address?: {
    municipality?: string;
    region?: string;
    country?: string;
  };
  webpage_url?: string;
  application_details?: {
    url?: string;
  };
  description?: {
    text?: string;
  };
  occupation?: {
    label?: string;
  };
};

type JobMatch = {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  source: "Arbetsförmedlingen";
  score: number;
  color: "green" | "orange" | "red";
  summary: string;
  description: string;
  missing?: string[];
};

function getColor(score: number): "green" | "orange" | "red" {
  if (score >= 70) return "green";
  if (score >= 45) return "orange";
  return "red";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

async function fetchArbetsformedlingenJobs(
  searchQuery: string,
  location?: string
) {
  const normalizedQuery = searchQuery.split("\n")[0].slice(0, 80).trim();
  const normalizedLocation = (location || "").split("\n")[0].slice(0, 80).trim();

  const url = `https://jobsearch.api.jobtechdev.se/search?q=${encodeURIComponent(
    normalizedQuery || "utvecklare"
  )}&limit=20`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Arbetsförmedlingen API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const hits: RawAfJob[] = Array.isArray(data?.hits) ? data.hits : [];

  const mappedJobs = hits.map((job, index) => ({
    id: String(job.id ?? `af-${index}`),
    title: job.headline || job.occupation?.label || "Untitled job",
    company: job.employer?.name || "Unknown employer",
    location:
      job.workplace_address?.municipality ||
      job.workplace_address?.region ||
      job.workplace_address?.country ||
      "Unknown location",
    url: job.webpage_url || job.application_details?.url || "#",
    description: job.description?.text || "",
  }));

  if (!normalizedLocation) {
    return mappedJobs;
  }

  const locationLower = normalizedLocation.toLowerCase();
  const filteredJobs = mappedJobs.filter((job) =>
    job.location.toLowerCase().includes(locationLower)
  );

  return filteredJobs.length > 0 ? filteredJobs : mappedJobs;
}

async function scoreJobWithOpenAI({
  cvText,
  jobDescription,
  jobTitle,
  company,
  location,
  lang,
  includeMissing,
}: {
  cvText: string;
  jobDescription: string;
  jobTitle: string;
  company: string;
  location: string;
  lang: "sv" | "en";
  includeMissing: boolean;
}) {
  const isSwedish = lang === "sv";

  const systemPrompt = includeMissing
    ? isSwedish
      ? `
Du är en strikt jobmatchningsmotor.

Din uppgift:
- analysera hur väl kandidatens CV matchar jobbannonsen
- ge ett matchvärde mellan 0 och 100
- ge en mycket kort motivering
- lista vad som saknas mest för att öka matchningen

Viktiga regler:
- var realistisk, inte snäll
- ge hög poäng bara om erfarenheten faktiskt passar
- saknade delar ska vara konkreta och korta
- svara ENDAST med JSON

Format:
{
  "score": number,
  "summary": "kort svensk sammanfattning, max 18 ord",
  "missing": ["saknad 1", "saknad 2", "saknad 3"]
}
`.trim()
      : `
You are a strict job matching engine.

Your task:
- analyze how well the candidate CV matches the job ad
- give a match score from 0 to 100
- give a very short explanation
- list the main missing parts needed to improve the match

Important rules:
- be realistic, not generous
- only give high scores when the profile truly fits
- missing items must be short and concrete
- return JSON only

Format:
{
  "score": number,
  "summary": "short English summary, max 18 words",
  "missing": ["missing 1", "missing 2", "missing 3"]
}
`.trim()
    : isSwedish
    ? `
Du är en strikt jobmatchningsmotor.

Din uppgift:
- analysera hur väl kandidatens CV matchar jobbannonsen
- ge ett matchvärde mellan 0 och 100
- ge en mycket kort motivering

Viktiga regler:
- var realistisk, inte snäll
- ge hög poäng bara om erfarenheten faktiskt passar
- svara ENDAST med JSON

Format:
{
  "score": number,
  "summary": "kort svensk sammanfattning, max 18 ord"
}
`.trim()
    : `
You are a strict job matching engine.

Your task:
- analyze how well the candidate CV matches the job ad
- give a match score from 0 to 100
- give a very short explanation

Important rules:
- be realistic, not generous
- only give high scores when the profile truly fits
- return JSON only

Format:
{
  "score": number,
  "summary": "short English summary, max 18 words"
}
`.trim();

  const userPrompt = isSwedish
    ? `
CV:
${cvText}

Jobbtitel:
${jobTitle}

Företag:
${company}

Plats:
${location}

Jobbannons:
${jobDescription}
`.trim()
    : `
CV:
${cvText}

Job title:
${jobTitle}

Company:
${company}

Location:
${location}

Job ad:
${jobDescription}
`.trim();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "OpenAI scoring failed");
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty score content");
  }

  const parsed = JSON.parse(content);

  return {
    score: clampScore(Number(parsed?.score) || 0),
    summary: String(parsed?.summary || ""),
    missing: Array.isArray(parsed?.missing)
      ? parsed.missing
          .map((item: unknown) => String(item).trim())
          .filter(Boolean)
          .slice(0, 3)
      : [],
  };
}

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return Response.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL" },
        { status: 500 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          error: "Du måste vara inloggad för att använda jobbmatchning.",
        },
        { status: 401 }
      );
    }

    const { data: appUser, error: userError } = await supabase
      .from("users")
      .select("plan, credits_used")
      .eq("clerk_user_id", String(userId))
      .maybeSingle();

    if (userError) {
      return Response.json(
        { error: userError.message || "Failed to fetch user" },
        { status: 500 }
      );
    }

    const plan = String(appUser?.plan || "free").toLowerCase();
    const creditsUsed = Number(appUser?.credits_used || 0);

    if (plan === "free") {
      return Response.json(
        {
          error: "Uppgradera till Pro för att använda jobbmatchning.",
          requiredPlan: "pro",
        },
        { status: 403 }
      );
    }

    if (plan === "pro" && creditsUsed >= 3) {
      return Response.json(
        {
          error: "Du har använt dina 3 jobbmatchningar. Uppgradera till Career+ för obegränsad jobbmatchning.",
          requiredPlan: "career+",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const cvText = String(body?.cvText || "").trim();
    const searchQuery = String(body?.searchQuery || "").trim();
    const location = String(body?.location || "").trim();
    const lang = body?.lang === "sv" ? "sv" : "en";

    if (!cvText) {
      return Response.json({ error: "Missing cvText" }, { status: 400 });
    }

    const jobs = await fetchArbetsformedlingenJobs(
      searchQuery || "utvecklare",
      location
    );

    const jobsWithDescriptions = jobs.filter((job) => job.description.trim());

    const isCareerPlus = plan === "career+";
    const maxJobsToScore = isCareerPlus ? 10 : 6;

    const scoredJobs = await Promise.all(
      jobsWithDescriptions.slice(0, maxJobsToScore).map(async (job) => {
        const ai = await scoreJobWithOpenAI({
          cvText,
          jobDescription: job.description,
          jobTitle: job.title,
          company: job.company,
          location: job.location,
          lang,
          includeMissing: isCareerPlus,
        });

        const result: JobMatch = {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          url: job.url,
          source: "Arbetsförmedlingen",
          score: ai.score,
          color: getColor(ai.score),
          summary: ai.summary,
          description: job.description,
        };

        if (isCareerPlus) {
          result.missing = ai.missing;
        }

        return result;
      })
    );

    scoredJobs.sort((a, b) => b.score - a.score);

    if (plan === "pro") {
      const { error: updateCreditsError } = await supabase
        .from("users")
        .update({
          credits_used: creditsUsed + 1,
        })
        .eq("clerk_user_id", String(userId));

      if (updateCreditsError) {
        return Response.json(
          {
            error:
              updateCreditsError.message ||
              "Kunde inte uppdatera användarens jobbmatchningar.",
          },
          { status: 500 }
        );
      }
    }

    return Response.json({
      jobs: scoredJobs,
      plan,
      remainingMatches: plan === "pro" ? Math.max(0, 2 - creditsUsed) : null,
    });
  } catch (error: any) {
    console.error("JOBS ROUTE ERROR:", error);

    return Response.json(
      {
        error: error?.message || "Failed to fetch matching jobs",
      },
      { status: 500 }
    );
  }
}
