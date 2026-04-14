export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { q = "", cefr, pos, nounClass, entryType } = await searchParams;

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<h1 className="text-xl font-semibold mb-6">
				Результаты поиска: <span className="text-primary">{q}</span>
			</h1>
			{/* TODO: fetch and render results */}
			<pre className="text-xs text-muted bg-surface p-4 rounded-lg">
				{JSON.stringify({ q, cefr, pos, nounClass, entryType }, null, 2)}
			</pre>
		</div>
	);
}
