type Props = {
  text: string;
  photoUrl?: string;
};

function extractSection(text: string, headings: string[], nextHeadings: string[]) {
  const lower = text.toLowerCase();

  const startHeading = headings.find((h) => lower.includes(h.toLowerCase()));
  if (!startHeading) return "";

  const startIndex = lower.indexOf(startHeading.toLowerCase());
  if (startIndex === -1) return "";

  const afterStart = text.slice(startIndex);
  const afterStartLower = afterStart.toLowerCase();

  let endIndex = afterStart.length;

  for (const next of nextHeadings) {
    const idx = afterStartLower.indexOf(next.toLowerCase());
    if (idx > 0 && idx < endIndex) {
      endIndex = idx;
    }
  }

  return afterStart.slice(0, endIndex).trim();
}

function cleanHeadingLine(line: string) {
  return line
    .replace(/^#+\s*/, "")
    .replace(/:$/, "")
    .trim();
}

function cleanBullet(line: string) {
  return line.replace(/^[-•]\s*/, "").trim();
}

function parseLines(section: string) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractTopIdentity(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);

  let name = "";
  let title = "";

  for (const line of lines) {
    const cleaned = line.replace(/^#+\s*/, "").trim();

    const isLikelyHeading =
      /summary|sammanfattning|kompetens|skills|experience|arbetslivserfarenhet|education|utbildning/i.test(
        cleaned
      );

    if (isLikelyHeading) continue;

    if (!name && cleaned.split(" ").length >= 2 && cleaned.length <= 40) {
      name = cleaned;
      continue;
    }

    if (!title && cleaned.length <= 40) {
      title = cleaned;
      break;
    }
  }

  return {
    name: name || "Ditt Namn",
    title: title || "YRKESTITEL",
  };
}

function extractContact(text: string) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(
    /(\+?\d[\d\s\-()]{6,}\d)/i
  );

  return {
    email: emailMatch?.[0] || "fornamn.efternamn@email.com",
    phone: phoneMatch?.[0] || "123-456 78 90",
  };
}

function splitCertificates(skillsSection: string) {
  const lines = parseLines(skillsSection).slice(1);

  const certificates: string[] = [];
  const skills: string[] = [];

  for (const line of lines) {
    const cleaned = cleanBullet(line);

    if (
      /cert|scrum|aws|azure|google|pmp|itil|safe|prince2/i.test(cleaned)
    ) {
      certificates.push(cleaned);
    } else {
      skills.push(cleaned);
    }
  }

  return { skills, certificates };
}

function parseExperience(lines: string[]) {
  const entries: { title: string; meta?: string; bullets: string[] }[] = [];

  let current: { title: string; meta?: string; bullets: string[] } | null = null;

  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    const isBullet = /^[-•]/.test(line);

    if (!current) {
      current = {
        title: cleanBullet(line),
        meta: undefined,
        bullets: [],
      };
      continue;
    }

    if (isBullet) {
      current.bullets.push(cleanBullet(line));
      continue;
    }

    if (!current.meta) {
      current.meta = line;
      continue;
    }

    if (current.title || current.meta || current.bullets.length) {
      entries.push(current);
    }

    current = {
      title: line,
      meta: undefined,
      bullets: [],
    };
  }

  if (current && (current.title || current.meta || current.bullets.length)) {
    entries.push(current);
  }

  return entries;
}

function parseEducation(lines: string[]) {
  const entries: { school: string; degree?: string; bullets: string[] }[] = [];

  let current: { school: string; degree?: string; bullets: string[] } | null = null;

  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    const isBullet = /^[-•]/.test(line);

    if (!current) {
      current = {
        school: cleanBullet(line),
        degree: undefined,
        bullets: [],
      };
      continue;
    }

    if (isBullet) {
      current.bullets.push(cleanBullet(line));
      continue;
    }

    if (!current.degree) {
      current.degree = line;
      continue;
    }

    if (current.school || current.degree || current.bullets.length) {
      entries.push(current);
    }

    current = {
      school: line,
      degree: undefined,
      bullets: [],
    };
  }

  if (current && (current.school || current.degree || current.bullets.length)) {
    entries.push(current);
  }

  return entries;
}

function SectionTitle({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div>
      <h2
        className={`text-[22px] font-semibold uppercase tracking-[0.18em] ${
          dark ? "text-white" : "text-slate-600"
        }`}
      >
        {children}
      </h2>
      <div
        className={`mt-3 h-px w-full ${
          dark ? "bg-white/25" : "bg-slate-300"
        }`}
      />
    </div>
  );
}

export function StyledResume({ text, photoUrl }: Props) {
  const summary = extractSection(
    text,
    ["Professional Summary", "Professionell sammanfattning", "Profile", "Profil"],
    [
      "Core Competencies",
      "Nyckelkompetenser",
      "Skills",
      "Professional Experience",
      "Arbetslivserfarenhet",
      "Experience",
      "Education",
      "Utbildning",
    ]
  );

  const skills = extractSection(
    text,
    ["Core Competencies", "Nyckelkompetenser", "Skills", "Kompetenser"],
    [
      "Professional Experience",
      "Arbetslivserfarenhet",
      "Experience",
      "Education",
      "Utbildning",
    ]
  );

  const experience = extractSection(
    text,
    ["Professional Experience", "Arbetslivserfarenhet", "Experience"],
    ["Education", "Utbildning"]
  );

  const education = extractSection(text, ["Education", "Utbildning"], []);

  const hasResumeSections = Boolean(summary || skills || experience || education);

  if (!hasResumeSections) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">Response</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-red-800">
          {text}
        </p>
      </div>
    );
  }

  const { name, title } = extractTopIdentity(text);
  const { email, phone } = extractContact(text);

  const summaryLines = parseLines(summary);
  const skillsLines = parseLines(skills);
  const experienceLines = parseLines(experience);
  const educationLines = parseLines(education);

  const profileText = summaryLines.slice(1).join(" ");
  const { skills: skillItems, certificates } = splitCertificates(skills);
  const experienceEntries = parseExperience(experienceLines);
  const educationEntries = parseEducation(educationLines);

  return (
    <div className="overflow-hidden bg-[#f7f7f7] text-slate-800">
      <div className="grid min-h-[1123px] grid-cols-[35%_65%]">
        <aside className="flex flex-col bg-[#98a2ab] text-white">
          <div className="px-10 pt-10">
            <div className="overflow-hidden bg-white">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profilbild"
                  className="h-[300px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center bg-[#d8dde2] text-center text-sm font-medium text-slate-500">
                  Profilbild
                </div>
              )}
            </div>
          </div>

          <div className="px-10 pt-12">
            <SectionTitle dark>Profil</SectionTitle>
            <p className="mt-6 text-[15px] leading-8 text-white/95">
              {profileText ||
                "Resultatinriktad och engagerad kandidat med relevant erfarenhet, stark samarbetsförmåga och fokus på att skapa värde i varje roll."}
            </p>
          </div>

          <div className="px-10 pt-12">
            <SectionTitle dark>Kompetenser</SectionTitle>
            <ul className="mt-6 space-y-3 text-[15px] leading-7 text-white/95">
              {(skillItems.length ? skillItems : ["Projektledning", "Kommunikation", "Problemlösning"])
                .slice(0, 8)
                .map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[11px] h-[5px] w-[5px] rounded-full bg-white/90" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="px-10 pb-10 pt-12">
            <SectionTitle dark>Certifikat</SectionTitle>
            <ul className="mt-6 space-y-3 text-[15px] leading-7 text-white/95">
              {(certificates.length ? certificates : ["Lägg till certifikat här"])
                .slice(0, 6)
                .map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[11px] h-[5px] w-[5px] rounded-full bg-white/90" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </aside>

        <main className="flex flex-col bg-[#f7f7f7]">
          <div className="bg-[#e3e4e8] px-14 py-14">
            <h1 className="font-serif text-[64px] leading-none tracking-tight text-slate-700">
              {name}
            </h1>
            <p className="mt-5 text-[24px] uppercase tracking-[0.18em] text-slate-500">
              {title}
            </p>
          </div>

          <div className="flex-1 px-14 py-12">
            <section>
              <SectionTitle>Arbetslivserfarenhet</SectionTitle>

              <div className="mt-8 space-y-9">
                {(experienceEntries.length
                  ? experienceEntries
                  : [
                      {
                        title: "Tidigare roll",
                        meta: "Företag | År - År",
                        bullets: ["Beskriv dina viktigaste resultat och ansvarsområden här."],
                      },
                    ]
                ).map((entry, i) => (
                  <div key={i}>
                    <h3 className="text-[18px] font-semibold text-slate-700">
                      {entry.title}
                    </h3>

                    {entry.meta && (
                      <p className="mt-1 text-[14px] italic text-slate-500">
                        {entry.meta}
                      </p>
                    )}

                    {entry.bullets.length > 0 && (
                      <ul className="mt-4 space-y-3 text-[15px] leading-8 text-slate-700">
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex gap-3">
                            <span className="mt-[12px] h-[5px] w-[5px] rounded-full bg-slate-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <SectionTitle>Utbildning</SectionTitle>

              <div className="mt-8 space-y-8">
                {(educationEntries.length
                  ? educationEntries
                  : [
                      {
                        school: "Universitet / Skola",
                        degree: "Examen / Inriktning",
                        bullets: ["Lägg till relevant utbildning här."],
                      },
                    ]
                ).map((entry, i) => (
                  <div key={i}>
                    <h3 className="text-[18px] font-semibold text-slate-700">
                      {entry.school}
                    </h3>

                    {entry.degree && (
                      <p className="mt-1 text-[15px] italic text-slate-500">
                        {entry.degree}
                      </p>
                    )}

                    {entry.bullets.length > 0 && (
                      <ul className="mt-3 space-y-3 text-[15px] leading-8 text-slate-700">
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex gap-3">
                            <span className="mt-[12px] h-[5px] w-[5px] rounded-full bg-slate-500" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-[#e3e4e8] px-14 py-8 text-[15px] text-slate-500">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9aa3ac] text-white">
                ☎
              </div>
              <span>{phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9aa3ac] text-white">
                ✉
              </div>
              <span>{email}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}