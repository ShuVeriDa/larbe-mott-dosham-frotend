"use client";

import type { Dictionary, Locale } from "@/i18n/dictionaries";
import { isApiError } from "@/shared/api";
import {
	AdminErrorState,
	AdminTableSkeleton,
	Breadcrumb,
} from "@/shared/ui/admin";
import Link from "next/link";
import type { FC } from "react";
import { useEntryEditor } from "../model";
import { EntryHead } from "./entry-head";
import { MetaSidebar } from "./meta-sidebar";
import { SaveBar } from "./save-bar";
import { SectionTabs } from "./section-tabs";
import { BasicTab } from "./tabs/basic-tab";
import { ExtraTab } from "./tabs/extra-tab";
import { GrammarTab } from "./tabs/grammar-tab";
import { JsonTab } from "./tabs/json-tab";
import { MeaningsTab } from "./tabs/meanings-tab";
import { PhraseologyTab } from "./tabs/phraseology-tab";

interface AdminEntryEditPageProps {
	id: string;
	lang: Locale;
	dict: Dictionary["admin"]["entryEdit"];
	entriesDict: Dictionary["admin"]["entries"];
	commonDict: Dictionary["admin"]["common"];
}

export const AdminEntryEditPage: FC<AdminEntryEditPageProps> = ({
	id,
	lang,
	dict,
	entriesDict,
	commonDict,
}) => {
	const editor = useEntryEditor({ id, lang, dict });
	const containerClass = "max-w-[1200px] mx-auto pb-24 px-4 sm:px-6 pt-6";

	if (editor.isLoading) {
		return (
			<section className={containerClass}>
				<AdminTableSkeleton rows={10} />
			</section>
		);
	}

	if (editor.isError) {
		const notFound =
			isApiError(editor.error) && editor.error.statusCode === 404;
		return (
			<section className={containerClass}>
				{notFound ? (
					<div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
						<div className="text-3xl mb-3">🔍</div>
						<div className="text-lg font-semibold text-[var(--text)] mb-2">
							{dict.notFound.title}
						</div>
						<p className="text-sm text-[var(--text-muted)] max-w-md mx-auto mb-4">
							{dict.notFound.description}
						</p>
						<Link
							href={`/${lang}/admin/entries`}
							className="btn btn-md btn-secondary"
						>
							{dict.notFound.back}
						</Link>
					</div>
				) : (
					<AdminErrorState
						title={commonDict.error}
						retryLabel={commonDict.retry}
						onRetry={() => editor.refetch()}
					/>
				)}
			</section>
		);
	}

	if (!editor.draft || !editor.entry) return null;

	const draft = editor.draft;

	const tabs = [
		{ value: "basic" as const, label: dict.tabs.basic },
		{
			value: "meanings" as const,
			label: dict.tabs.meanings,
			dot: editor.tab === "meanings" && !editor.fullJsonValid,
		},
		{ value: "grammar" as const, label: dict.tabs.grammar },
		{ value: "phraseology" as const, label: dict.tabs.phraseology },
		{ value: "extra" as const, label: dict.tabs.extra },
		{ value: "json" as const, label: dict.tabs.json },
	];

	return (
		<article className={containerClass}>
			<Breadcrumb
				items={[
					{ label: dict.breadcrumb.dashboard, href: `/${lang}/admin` },
					{
						label: entriesDict.header.title,
						href: `/${lang}/admin/entries`,
					},
					{ label: `${draft.word} #${draft.id}` },
				]}
			/>

			<EntryHead
				entry={draft}
				lang={lang}
				dict={dict.header}
				onDelete={editor.remove}
				isDeleting={editor.isDeleting}
			/>

			<SectionTabs tabs={tabs} active={editor.tab} onSelect={editor.setTab} />

			<div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
				<div>
					{editor.tab === "basic" ? (
						<BasicTab draft={draft} onPatch={editor.patch} dict={dict} />
					) : null}
					{editor.tab === "meanings" ? (
						<MeaningsTab
							draft={draft}
							onPatch={editor.patch}
							dict={dict}
							onJsonValidityChange={editor.setFullJsonValid}
						/>
					) : null}
					{editor.tab === "grammar" ? (
						<GrammarTab draft={draft} onPatch={editor.patch} dict={dict} />
					) : null}
					{editor.tab === "phraseology" ? (
						<PhraseologyTab
							draft={draft}
							onPhrasesChange={(next) => editor.patch("setPhrases", next)}
							onCitationsChange={(next) => editor.patch("citations", next)}
							dict={dict}
						/>
					) : null}
					{editor.tab === "extra" ? (
						<ExtraTab
							draft={draft}
							onPatch={editor.patch}
							dict={dict}
							lang={lang}
						/>
					) : null}
					{editor.tab === "json" ? (
						<JsonTab
							value={editor.fullJson}
							onChange={editor.applyFullJson}
							onValidityChange={editor.setFullJsonValid}
							dict={dict}
						/>
					) : null}
				</div>

				<MetaSidebar
					draft={draft}
					entryId={id}
					dict={dict.metaPanel}
					lang={lang}
				/>
			</div>

			<SaveBar
				visible={editor.isDirty}
				isSaving={editor.isSaving}
				onSave={editor.save}
				onCancel={editor.discardChanges}
				dict={dict.saveBar}
			/>
		</article>
	);
};
