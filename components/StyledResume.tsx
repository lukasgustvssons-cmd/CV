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
    .slice(0, 10);

  let name = "";
  let title = "";

  for (const line of lines) {
    const cleaned = line.replace(/^#+\s*/, "").trim();

    const isLikelyHeading =
      /summary|sammanfattning|kompetens|skills|experience|arbetslivserfarenhet|education|utbildning|professional summary|core competencies|professional experience/i.test(
        cleaned
      );

    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
    const looksLikePhone = /(\+?\d[\d\s\-()]{6,}\d)/.test(cleaned);

    if (isLikelyHeading || looksLikeEmail || looksLikePhone) continue;

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
    name: name || "Ditt namn",
    title: title || "YRKESROLL",
  };
}

function extractContact(text: string) {
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/(\+?\d[\d\s\-()]{6,}\d)/i);

  return {
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0] || "",
  };
}

function splitCertificates(skillsSection: string) {
  const lines = parseLines(skillsSection).slice(1);

  const certificates: string[] = [];
  const skills: string[] = [];

  for (const line of lines) {
    const cleaned = cleanBullet(line);

    if (
      /cert|scrum|aws|azure|google|pmp|itil|safe|prince2|certifier/i.test(cleaned)
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
        className={`text-[18px] font-semibold uppercase tracking-[0.16em] sm:text-[22px] ${
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
      "Kompetenser",
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
  const experienceLines = parseLines(experience);
  const educationLines = parseLines(education);

  const profileText = summaryLines.slice(1).join(" ");
  const { skills: skillItems, certificates } = splitCertificates(skills);
  const experienceEntries = parseExperience(experienceLines);
  const educationEntries = parseEducation(educationLines);

  const hasPhoto = Boolean(photoUrl);
  const hasPhone = Boolean(phone);
  const hasEmail = Boolean(email);

  return (
    <div className="h-full w-full overflow-hidden bg-[#f7f7f7] text-slate-800">
      <div className="grid min-h-full grid-cols-1 md:grid-cols-[34%_66%]">
        <aside className="flex flex-col bg-[#98a2ab] text-white">
          <div className="px-6 pt-6 sm:px-8 sm:pt-8 md:px-8 md:pt-8 lg:px-10 lg:pt-10">
            <div className="overflow-hidden rounded-sm bg-white/10">
              {hasPhoto ? (
                <img
                  src={photoUrl}
                  alt="Profilbild"
                  className="h-[220px] w-full object-cover sm:h-[260px] md:h-[280px] lg:h-[300px]"
                />
              ) : (
                <div className="flex h-[220px] w-full items-center justify-center border border-white/20 bg-white/5 sm:h-[260px] md:h-[280px] lg:h-[300px]">
                  <div className="text-center text-xs uppercase tracking-[0.16em] text-white/60">
                    Ingen profilbild
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 pt-8 sm:px-8 md:px-8 lg:px-10 lg:pt-10">
            <SectionTitle dark>Profil</SectionTitle>
            <p className="mt-5 text-[14px] leading-7 text-white/95 sm:text-[15px] sm:leading-8">
              {profileText ||
                "Resultatinriktad och engagerad kandidat med relevant erfarenhet, stark samarbetsförmåga och fokus på att skapa värde i varje roll."}
            </p>
          </div>

          <div className="px-6 pt-8 sm:px-8 md:px-8 lg:px-10 lg:pt-10">
            <SectionTitle dark>Kompetenser</SectionTitle>
            <ul className="mt-5 space-y-3 text-[14px] leading-7 text-white/95 sm:text-[15px]">
              {(skillItems.length
                ? skillItems
                : ["Projektledning", "Kommunikation", "Problemlösning"])
                .slice(0, 8)
                .map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-white/90" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className="px-6 pb-8 pt-8 sm:px-8 md:px-8 lg:px-10 lg:pb-10 lg:pt-10">
            <SectionTitle dark>Certifikat</SectionTitle>
            <ul className="mt-5 space-y-3 text-[14px] leading-7 text-white/95 sm:text-[15px]">
              {(certificates.length ? certificates : ["Inga certifikat angivna"])
                .slice(0, 6)
                .map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-white/90" />
                    <span>{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col bg-[#f7f7f7]">
          <div className="bg-[#e3e4e8] px-6 py-8 sm:px-8 sm:py-10 md:px-10 lg:px-14 lg:py-14">
            <h1 className="break-words font-serif text-[34px] leading-none tracking-tight text-slate-700 sm:text-[42px] md:text-[48px] lg:text-[64px]">
              {name}
            </h1>

            <p className="mt-4 text-[14px] uppercase tracking-[0.18em] text-slate-500 sm:text-[16px] md:text-[18px] lg:mt-5 lg:text-[24px]">
              {title}
            </p>
          </div>

          <div className="flex-1 px-6 py-8 sm:px-8 sm:py-10 md:px-10 lg:px-14 lg:py-12">
            <section>
              <SectionTitle>Arbetslivserfarenhet</SectionTitle>

              <div className="mt-6 space-y-8 sm:mt-8 sm:space-y-9">
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
                    <h3 className="text-[17px] font-semibold text-slate-700 sm:text-[18px]">
                      {entry.title}
                    </h3>

                    {entry.meta && (
                      <p className="mt-1 text-[13px] italic text-slate-500 sm:text-[14px]">
                        {entry.meta}
                      </p>
                    )}

                    {entry.bullets.length > 0 && (
                      <ul className="mt-4 space-y-3 text-[14px] leading-7 text-slate-700 sm:text-[15px] sm:leading-8">
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex gap-3">
                            <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-slate-500 sm:mt-[12px]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 sm:mt-12 lg:mt-14">
              <SectionTitle>Utbildning</SectionTitle>

              <div className="mt-6 space-y-7 sm:mt-8 sm:space-y-8">
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
                    <h3 className="text-[17px] font-semibold text-slate-700 sm:text-[18px]">
                      {entry.school}
                    </h3>

                    {entry.degree && (
                      <p className="mt-1 text-[14px] italic text-slate-500 sm:text-[15px]">
                        {entry.degree}
                      </p>
                    )}

                    {entry.bullets.length > 0 && (
                      <ul className="mt-3 space-y-3 text-[14px] leading-7 text-slate-700 sm:text-[15px] sm:leading-8">
                        {entry.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="flex gap-3">
                            <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-slate-500 sm:mt-[12px]" />
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

          {(hasPhone || hasEmail) && (
            <div className="grid grid-cols-1 gap-4 bg-[#e3e4e8] px-6 py-6 text-[14px] text-slate-500 sm:grid-cols-2 sm:gap-6 sm:px-8 md:px-10 lg:px-14 lg:py-8 lg:text-[15px]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9aa3ac] text-white">
                  ☎
                </div>
                <span className="break-all">{phone || "Ej angivet"}</span>
              </div>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9aa3ac] text-white">
                  ✉
                </div>
                <span className="break-all">{email || "Ej angivet"}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
