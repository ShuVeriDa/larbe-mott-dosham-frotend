"use client";

import {
	useAdminEntry,
	useDeleteAdminEntry,
	useUpdateAdminEntry,
} from "@/features/admin-entries";
import type { Dictionary, Locale } from "@/i18n/dictionaries";
import {
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
	PageHeader,
	SectionCard,
} from "@/shared/ui/admin";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

interface AdminEntryEditPageProps {
	id: string;
	lang: Locale;
	dict: Dictionary["admin"]["entryEdit"];
	entriesDict: Dictionary["admin"]["entries"];
	commonDict: Dictionary["admin"]["common"];
}

type Tab = "basic" | "meanings" | "grammar" | "phraseology" | "extra" | "json";

export const AdminEntryEditPage: FC<AdminEntryEditPageProps> = ({
	id,
	lang,
	dict,
	entriesDict,
	commonDict,
}) => {
	const router = useRouter();
	const entryQuery = useAdminEntry(id);
	const updateMutation = useUpdateAdminEntry();
	const deleteMutation = useDeleteAdminEntry();

	const [tab, setTab] = useState<Tab>("basic");
	const [jsonDraft, setJsonDraft] = useState("");
	const [jsonValid, setJsonValid] = useState(true);
	const [dirty, setDirty] = useState(false);

	const entry = entryQuery.data;

	useEffect(() => {
		if (entry) setJsonDraft(JSON.stringify(entry, null, 2));
	}, [entry]);

	useEffect(() => {
		if (!dirty) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [dirty]);

	const onJsonChange = (val: string) => {
		setJsonDraft(val);
		setDirty(true);
		try {
			JSON.parse(val);
			setJsonValid(true);
		} catch {
			setJsonValid(false);
		}
	};

	const onSave = async () => {
		if (!jsonValid) return;
		try {
			const payload = JSON.parse(jsonDraft);
			await updateMutation.mutateAsync({ id, payload });
			setDirty(false);
		} catch {
			// surface via mutation.isError
		}
	};

	const onDelete = async () => {
		if (!window.confirm(commonDict.confirm)) return;
		await deleteMutation.mutateAsync({ id });
		router.push(`/${lang}/admin/entries`);
	};

	const tabs: { value: Tab; label: string }[] = useMemo(
		() => [
			{ value: "basic", label: dict.tabs.basic },
			{ value: "meanings", label: dict.tabs.meanings },
			{ value: "grammar", label: dict.tabs.grammar },
			{ value: "phraseology", label: dict.tabs.phraseology },
			{ value: "extra", label: dict.tabs.extra },
			{ value: "json", label: dict.tabs.json },
		],
		[dict],
	);

	if (entryQuery.isLoading) return <AdminTableSkeleton rows={10} />;
	if (entryQuery.isError)
		return (
			<AdminErrorState
				title={commonDict.error}
				retryLabel={commonDict.retry}
				onRetry={() => entryQuery.refetch()}
			/>
		);
	if (!entry) return null;

	return (
		<article className="max-w-[1200px] mx-auto pb-24">
			<Breadcrumb
				items={[
					{ label: entriesDict.header.title, href: `/${lang}/admin/entries` },
					{ label: dict.breadcrumb.edit },
				]}
			/>
			<PageHeader
				title={entry.word}
				subtitle={`#${entry.id} · ${entry.partOfSpeech ?? ""}`}
				actions={
					<>
						<a
							href={`/${lang}/entry/${entry.id}`}
							target="_blank"
							rel="noreferrer"
							className="btn btn-sm btn-secondary"
						>
							{dict.header.view}
						</a>
						<a
							href={`/${lang}/admin/audit/entries/${entry.id}`}
							className="btn btn-sm btn-secondary"
						>
							{dict.header.audit}
						</a>
						<button
							type="button"
							onClick={onDelete}
							className="btn btn-sm btn-secondary text-[var(--danger)]"
						>
							{dict.header.delete}
						</button>
					</>
				}
			/>

			<div className="flex gap-2 mb-6 flex-wrap border-b border-[var(--border)] pb-2">
				{tabs.map((t) => (
					<button
						key={t.value}
						type="button"
						onClick={() => setTab(t.value)}
						className={
							"px-3 py-2 text-sm rounded-md transition-colors " +
							(tab === t.value
								? "bg-[var(--accent-dim)] text-[var(--accent)]"
								: "text-[var(--text-muted)] hover:text-[var(--text)]")
						}
					>
						{t.label}
					</button>
				))}
			</div>

			{tab === "json" ? (
				<SectionCard
					title={dict.tabs.json}
					actions={
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => {
									try {
										setJsonDraft(
											JSON.stringify(JSON.parse(jsonDraft), null, 2),
										);
									} catch {
										// no-op
									}
								}}
								className="btn btn-sm btn-secondary"
							>
								{dict.json.format}
							</button>
							<span
								className={
									"text-xs font-medium " +
									(jsonValid
										? "text-[var(--success)]"
										: "text-[var(--danger)]")
								}
							>
								{jsonValid ? dict.json.valid : dict.json.invalid}
							</span>
						</div>
					}
				>
					<textarea
						value={jsonDraft}
						onChange={(e) => onJsonChange(e.target.value)}
						className="w-full min-h-[520px] font-mono text-xs bg-[var(--code-bg)] border border-[var(--code-border)] rounded-md p-3 text-[var(--text)]"
						spellCheck={false}
					/>
				</SectionCard>
			) : (
				<SectionCard title={dict.tabs[tab]}>
					<div className="text-sm text-[var(--text-muted)]">
						{/* Placeholder for structured tab editors — switch to JSON tab for raw editing. */}
						{commonDict.loading}
					</div>
					<pre className="mt-4 text-xs bg-[var(--code-bg)] border border-[var(--code-border)] rounded-md p-3 overflow-auto font-mono text-[var(--text-muted)]">
{JSON.stringify(
	tab === "basic"
		? {
				word: entry.word,
				wordAccented: entry.wordAccented,
				partOfSpeech: entry.partOfSpeech,
				nounClass: entry.nounClass,
				wordLevel: entry.wordLevel,
			}
		: tab === "meanings"
			? (entry.meanings ?? [])
			: tab === "phraseology"
				? (entry.setPhrases ?? [])
				: entry,
	null,
	2,
)}
					</pre>
				</SectionCard>
			)}

			{dirty ? (
				<div className="fixed bottom-0 left-0 right-0 md:left-[260px] bg-[var(--bg-overlay)] backdrop-blur-xl border-t border-[var(--border)] px-6 py-3 flex items-center justify-between gap-3 z-40">
					<span className="text-sm text-[var(--warning)]">
						{dict.saveBar.unsaved}
					</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => {
								if (entry) setJsonDraft(JSON.stringify(entry, null, 2));
								setDirty(false);
							}}
							className="btn btn-sm btn-secondary"
						>
							{dict.saveBar.cancel}
						</button>
						<button
							type="button"
							onClick={onSave}
							disabled={!jsonValid || updateMutation.isPending}
							className="btn btn-md btn-primary disabled:opacity-40"
						>
							{dict.saveBar.save}
						</button>
					</div>
				</div>
			) : null}
		</article>
	);
};
