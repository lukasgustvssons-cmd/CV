export type Lang = "en" | "sv";

export const copy = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How it works",
      demo: "Demo",
      pricing: "Pricing",
      getStarted: "Get Started",
      language: "SV",
    },

    hero: {
      eyebrow: "AI-DRIVEN JOB SEARCH PLATFORM",
      title: "Your next job application, tailored in seconds.",
      description:
        "Create a polished resume, tailor it to the role you want, and discover matching jobs with AI.",
      primaryCta: "Get Started",
      secondaryCta: "Try Demo",
      profileSummary: "Profile Summary",
      profileText:
        "Product-minded marketer with B2B SaaS growth experience.",
      matchScore: "Match Score",
      tailoredResumeReady: "Tailored resume ready",
      coverLetterGenerated: "Cover letter generated",
      atsSuggestions: "ATS-friendly suggestions included",
    },

    demo: {
      eyebrow: "LIVE DEMO",
      title: "Create a tailored resume in seconds",
      description:
        "Paste your experience and the role you want to generate a cleaner, more professional resume.",
      formTitle: "Create your resume",
      formDescription: "Add your experience and target role below.",
      experienceLabel: "Experience",
      experiencePlaceholder:
        "Example: 2 years in sales, customer meetings, CRM, onboarding, budgeting...",
      jobLabel: "Target role",
      jobPlaceholder:
        "Write the type of role you want, e.g. machine operator, sales, or property maintenance",
      locationLabel: "Location",
      locationPlaceholder: "For example Stockholm",
      generate: "Generate resume",
      generating: "Generating...",
      previewTitle: "Preview",
      previewDescription: "This is how the exported resume will look.",
      download: "Download PDF",
      downloading: "Downloading...",
      emptyTitle: "Your resume preview will appear here",
      emptyText:
        "Fill in your experience and target role, then click Generate resume.",
      fileName: "resume.pdf",
      validation: "Please fill in both fields.",
      error: "Something went wrong. Please try again.",
    },
  },

  sv: {
    nav: {
      features: "Funktioner",
      howItWorks: "Så fungerar det",
      demo: "Demo",
      pricing: "Priser",
      getStarted: "Kom igång",
      language: "EN",
    },

    hero: {
      eyebrow: "AI-DRIVEN JOB SEARCH PLATFORM",
      title: "Din nästa jobbansökan, skräddarsydd på sekunder.",
      description:
        "Skapa ett professionellt CV, anpassa det till rollen du vill ha och hitta matchande jobb med AI.",
      primaryCta: "Kom igång",
      secondaryCta: "Testa demo",
      profileSummary: "Profilsammanfattning",
      profileText:
        "Resultatinriktad marknadsförare med erfarenhet av B2B SaaS-tillväxt.",
      matchScore: "Matchningsgrad",
      tailoredResumeReady: "Anpassat CV klart",
      coverLetterGenerated: "Personligt brev genererat",
      atsSuggestions: "ATS-anpassade förbättringar inkluderade",
    },

    demo: {
      eyebrow: "LIVE DEMO",
      title: "Skapa ett skräddarsytt CV på sekunder",
      description:
        "Klistra in din erfarenhet och rollen du vill ha för att skapa ett renare och mer professionellt CV.",
      formTitle: "Skapa ditt CV",
      formDescription: "Lägg till din erfarenhet och målroll nedan.",
      experienceLabel: "Erfarenhet",
      experiencePlaceholder:
        "Exempel: 2 år inom försäljning, kundmöten, CRM, onboarding, budgetansvar...",
      jobLabel: "Målroll",
      jobPlaceholder:
        "Skriv vilken typ av jobb du söker, t.ex. maskinförare, säljare eller fastighetsskötare",
      locationLabel: "Ort",
      locationPlaceholder: "Till exempel Stockholm",
      generate: "Generera CV",
      generating: "Genererar...",
      previewTitle: "Förhandsvisning",
      previewDescription: "Så här kommer det exporterade CV:t att se ut.",
      download: "Ladda ner PDF",
      downloading: "Laddar ner...",
      emptyTitle: "Din CV-förhandsvisning visas här",
      emptyText:
        "Fyll i din erfarenhet och målroll, och klicka sedan på Generera CV.",
      fileName: "cv.pdf",
      validation: "Fyll i båda fälten.",
      error: "Något gick fel. Försök igen.",
    },
  },
} as const;