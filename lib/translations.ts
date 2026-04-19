export type Lang = "en" | "sv";

export const copy = {
  en: {
    nav: {
      features: "Features",
      howItWorks: "How it works",
      demo: "See how it works",
      pricing: "Pricing",
      getStarted: "Get started",
      language: "SV",
    },

    hero: {
      eyebrow: "FOR PEOPLE WHO WANT TO APPLY SMARTER",
      title: "Get a stronger resume and better job applications faster.",
      description:
        "NEXOR helps you create clearer resumes, stronger cover letters, and more focused job applications with less stress.",
      primaryCta: "Get started",
      secondaryCta: "See how it works",
      profileSummary: "PROFILE SUMMARY",
      profileText:
        "Results-driven marketer with experience in B2B, growth, and customer communication.",
      matchScore: "MATCH SCORE",
      tailoredResumeReady: "Resume ready",
      coverLetterGenerated: "Cover letter prepared",
      atsSuggestions: "Suggestions to make your application clearer and more relevant",
    },

    demo: {
      eyebrow: "SEE HOW IT WORKS",
      title: "Create a stronger resume in a few minutes",
      description:
        "Add your experience and the role you want. NEXOR helps you turn it into a clear and professional resume right away.",
      formTitle: "Create your resume",
      formDescription: "Add your background and target role below.",
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
      previewDescription: "This is how your resume can look.",
      download: "Download PDF",
      downloading: "Downloading...",
      emptyTitle: "Your resume preview appears here",
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
      demo: "Se hur det fungerar",
      pricing: "Priser",
      getStarted: "Kom igång",
      language: "EN",
    },

    hero: {
      eyebrow: "FÖR DIG SOM VILL SÖKA JOBB SMARTARE",
      title: "Få bättre CV, starkare ansökningar och fler chanser till intervju.",
      description:
        "NEXOR hjälper dig skapa tydligare CV, starkare personliga brev och mer relevanta ansökningar snabbare.",
      primaryCta: "Kom igång",
      secondaryCta: "Se hur det fungerar",
      profileSummary: "PROFILSAMMANFATTNING",
      profileText:
        "Resultatinriktad kandidat med tydlig erfarenhet, stark kommunikation och bättre förutsättningar att sticka ut i urvalet.",
      matchScore: "MATCHNINGSGRAD",
      tailoredResumeReady: "CV klart att använda",
      coverLetterGenerated: "Personligt brev framtaget",
      atsSuggestions: "Förslag för att göra ansökan tydligare och mer relevant",
    },

    demo: {
      eyebrow: "SÅ SER DET UT",
      title: "Skapa ett starkare CV på några minuter",
      description:
        "Fyll i din erfarenhet och vilken roll du söker. NEXOR hjälper dig formulera ett tydligt och professionellt CV direkt.",
      formTitle: "Skapa ditt CV",
      formDescription: "Lägg till din bakgrund och målroll nedan.",
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
      previewDescription: "Så här kan ditt CV se ut.",
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
