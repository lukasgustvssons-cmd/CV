export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold mb-6">Användarvillkor</h1>

      <p className="mb-4">
        Genom att använda TailorCV godkänner du dessa villkor.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Tjänsten</h2>
      <p className="mb-4">
        TailorCV erbjuder AI-genererade CV, personliga brev och jobbmatchning.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Ansvar</h2>
      <p className="mb-4">
        Du ansvarar för hur du använder innehållet som genereras.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Betalning</h2>
      <p className="mb-4">
        Betalda planer hanteras via Stripe.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Ansvarsbegränsning</h2>
      <p className="mb-4">
        Vi ansvarar inte för beslut baserade på AI-genererat innehåll.
      </p>
    </main>
  );
}