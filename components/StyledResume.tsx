type Props = {
  text: string;
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

export function StyledResume({ text }: Props) {
  const summary = extractSection(
    text,
    ["Professional Summary", "Professionell sammanfattning"],
    ["Core Competencies", "Nyckelkompetenser", "Professional Experience", "Arbetslivserfarenhet", "Education", "Utbildning"]
  );

  const skills = extractSection(
    text,
    ["Core Competencies", "Nyckelkompetenser", "Skills"],
    ["Professional Experience", "Arbetslivserfarenhet", "Education", "Utbildning"]
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

  const summaryLines = summary.split("\n").filter(Boolean);
  const skillsLines = skills.split("\n").filter(Boolean);
  const experienceLines = experience.split("\n").filter(Boolean);
  const educationLines = education.split("\n").filter(Boolean);

  return (
    <div className="space-y-10">
      {summary && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {summaryLines[0]}
          </h2>
          <div className="mt-3 h-[2px] w-10 bg-slate-900" />
          <p className="mt-4 text-[15px] leading-7 text-slate-800">
            {summaryLines.slice(1).join(" ")}
          </p>
        </section>
      )}

      {skills && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {skillsLines[0]}
          </h2>
          <div className="mt-3 h-[2px] w-10 bg-slate-900" />
          <ul className="mt-5 grid grid-cols-2 gap-x-10 gap-y-2 text-[14px] text-slate-800">
            {skillsLines
              .slice(1)
              .filter((item) => item.trim())
              .map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[6px] h-[4px] w-[4px] rounded-full bg-slate-900" />
                  <span>{item.replace(/^-\s*/, "").trim()}</span>
                </li>
              ))}
          </ul>
        </section>
      )}

      {experience && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {experienceLines[0]}
          </h2>
          <div className="mt-3 h-[2px] w-10 bg-slate-900" />
          <div className="mt-6 space-y-4 text-[14px] leading-7 text-slate-800">
            {experienceLines
              .slice(1)
              .filter((line) => line.trim())
              .map((line, i) => {
                const trimmed = line.trim();
                const isBullet = trimmed.startsWith("-");

                if (isBullet) {
                  return (
                    <div key={i} className="flex gap-2">
                      <span className="mt-[8px] h-[4px] w-[4px] rounded-full bg-slate-900" />
                      <span>{trimmed.replace(/^-\s*/, "")}</span>
                    </div>
                  );
                }

                return (
                  <p key={i} className="font-medium text-slate-900">
                    {trimmed}
                  </p>
                );
              })}
          </div>
        </section>
      )}

      {education && (
        <section>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {educationLines[0]}
          </h2>
          <div className="mt-3 h-[2px] w-10 bg-slate-900" />
          <p className="mt-4 text-[14px] text-slate-800">
            {educationLines.slice(1).join(" ")}
          </p>
        </section>
      )}
    </div>
  );
}