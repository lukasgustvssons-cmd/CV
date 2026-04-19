export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold mb-6">Integritetspolicy</h1>

      <p className="mb-4">
        Vi värnar om din integritet och behandlar din data ansvarsfullt.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Data vi samlar</h2>
      <p className="mb-4">
        Vi samlar in information du själv anger, såsom erfarenhet och CV-data.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Hur vi använder data</h2>
      <p className="mb-4">
        Din data används för att generera CV och matcha jobb via AI.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Tredjepart</h2>
      <p className="mb-4">
        Vi använder tjänster som OpenAI, Clerk och Supabase.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Lagring</h2>
      <p className="mb-4">
        Vi lagrar endast nödvändig data för att leverera tjänsten.
      </p>
    </main>
  );
}
