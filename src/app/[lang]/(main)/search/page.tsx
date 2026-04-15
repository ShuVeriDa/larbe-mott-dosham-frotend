import { getDictionary, hasLocale } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [dict, { q = "", cefr, pos, nounClass, entryType }] =
    await Promise.all([getDictionary(lang), searchParams]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">
        {dict.nav.dictionary}:{" "}
        <span className="text-primary">{q}</span>
      </h1>
      {/* TODO: fetch and render results */}
      <pre className="text-xs text-muted bg-surface p-4 rounded-lg">
        {JSON.stringify({ q, cefr, pos, nounClass, entryType }, null, 2)}
      </pre>
    </div>
  );
}
