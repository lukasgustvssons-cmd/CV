export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">

        {/* HERO */}
        <section className="mb-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Vilka är vi
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Varför vi byggde Hireon
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Jobbsökande ska inte vara ett gissningsspel.
          </p>
        </section>

        {/* PROBLEM */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Problemet
          </h2>

          <div className="mt-6 space-y-4 text-slate-600 leading-7 text-lg">
            <p>
              Att söka jobb idag är frustrerande.
            </p>

            <p>
              För många är det svårt att ens komma igång. Det är svårt att veta hur ett bra CV ska se ut,
              vad man ska skriva – och vad man ska ta bort.
            </p>

            <p>
              Du skickar ansökningar utan att få svar. Du vet inte vad som är bra eller vad som saknas.
            </p>

            <p>
              Det känns ofta som att du chansar — utan tydlig feedback.
            </p>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Lösningen
          </h2>

          <div className="mt-6 space-y-4 text-slate-600 leading-7 text-lg">
            <p>
              Vi byggde Hireon för att ge dig tydlighet.
            </p>

            <p>
              Inte bara för att skapa ett CV — utan för att hjälpa dig förstå vad som faktiskt kan öka dina chanser att få en intervju.
            </p>

            <p>
              Med hjälp av AI kan du:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Skapa ett starkt CV snabbt</li>
              <li>Matcha ditt CV mot riktiga jobb från Arbetsförmedlingen</li>
              <li>Få konkreta förbättringsförslag baserat på jobbet du söker</li>
              <li>Anpassa ditt CV för en specifik roll istället för att skicka samma överallt</li>
            </ul>

            <p>
              Hireon granskar ditt CV, jämför det med jobbannonser och visar vad du saknar — så du slipper gissa.
            </p>
          </div>
        </section>

        {/* EXTRA VALUE */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Mer än bara CV
          </h2>

          <div className="mt-6 space-y-4 text-slate-600 leading-7 text-lg">
            <p>
              Att få ett jobb handlar inte bara om att bli kallad till intervju.
            </p>

            <p>
              Därför hjälper Hireon dig också med:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Vanliga intervjufrågor</li>
              <li>Vad arbetsgivaren faktiskt letar efter</li>
              <li>Vad du bör lyfta i intervjun</li>
              <li>Vad du behöver förbereda innan</li>
            </ul>

            <p>
              Målet är att hjälpa dig hela vägen — inte bara första steget.
            </p>
          </div>
        </section>

        {/* VISION */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-900">
            Vår vision
          </h2>

          <div className="mt-6 space-y-4 text-slate-600 leading-7 text-lg">
            <p>
              Vi vill göra jobbsökande smartare, enklare och mindre ensamt.
            </p>

            <p>
              Alla ska kunna förstå hur man förbättrar sin ansökan — utan att behöva gissa eller känna sig osäker.
            </p>
          </div>
        </section>

        {/* END */}
        <section className="text-center">
          <p className="text-xl font-medium text-slate-900">
            Detta är bara början.
          </p>

          <p className="mt-4 text-slate-600 text-lg">
            Hireon kommer fortsätta utvecklas för att hjälpa dig hela vägen till jobb.
          </p>

          <div className="mt-8">
            <a
              href="/#demo"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Testa Hireon
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}