export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        
        {/* HERO */}
        <section className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Vilka är vi
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Varför vi byggde Hireon
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">
            Vi tycker att jobbsökande borde vara tydligt, inte förvirrande.
          </p>
        </section>

        {/* PROBLEM */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-slate-900">
            Problemet
          </h2>

          <div className="mt-4 space-y-4 text-slate-600 leading-7">
            <p>
              Att söka jobb idag är frustrerande.
            </p>
            <p>
              Du skickar ansökningar utan att få svar.
              Du vet inte vad som är bra eller vad som saknas.
            </p>
            <p>
              Det känns ofta som att man chansar – utan tydlig feedback.
            </p>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-slate-900">
            Lösningen
          </h2>

          <div className="mt-4 space-y-4 text-slate-600 leading-7">
            <p>
              Vi byggde Hireon för att ge dig tydlighet.
            </p>
            <p>
              Inte bara för att skapa ett CV – utan för att hjälpa dig förstå
              vad som faktiskt kan öka dina chanser att få en intervju.
            </p>
            <p>
              Med hjälp av AI kan du snabbt förbättra ditt CV, matcha mot jobb
              och få konkreta insikter istället för att gissa.
            </p>
          </div>
        </section>

        {/* VISION */}
        <section className="mb-14">
          <h2 className="text-2xl font-semibold text-slate-900">
            Vår vision
          </h2>

          <div className="mt-4 space-y-4 text-slate-600 leading-7">
            <p>
              Vi vill göra jobbsökande smartare, enklare och mindre ensamt.
            </p>
            <p>
              Alla ska kunna förstå hur man förbättrar sin ansökan – utan att behöva
              gissa eller känna sig osäker.
            </p>
          </div>
        </section>

        {/* END */}
        <section className="text-center">
          <p className="text-lg font-medium text-slate-900">
            Detta är bara början.
          </p>

          <p className="mt-4 text-slate-600">
            Hireon kommer fortsätta utvecklas för att hjälpa dig hela vägen till jobb.
          </p>
        </section>

      </div>
    </main>
  );
}