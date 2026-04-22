"use client";

import type { DictionaryEntry } from "@/entities/dictionary";
import { isNounPos, isVerbPos } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import { type FC, useMemo } from "react";
import { useEntryTab, type EntryTabId } from "../model/use-entry-tab";
import { CitationsPanel } from "./citations-panel";
import { ConjugationPanel } from "./conjugation-panel";
import { DeclensionPanel } from "./declension-panel";
import { MeaningsPanel } from "./meanings-panel";
import { PhraseologyPanel } from "./phraseology-panel";
import { SourcesPanel } from "./sources-panel";

interface EntryTabsProps {
	entry: DictionaryEntry;
	dict: Dictionary["entry"];
}

interface TabDescriptor {
	id: EntryTabId;
	label: string;
	count?: number;
}

export const EntryTabs: FC<EntryTabsProps> = ({ entry, dict }) => {
	const isVerb = isVerbPos(entry.partOfSpeech);
	const isNoun = isNounPos(entry.partOfSpeech);

	const tabs: TabDescriptor[] = useMemo(() => {
		const list: TabDescriptor[] = [
			{
				id: "meanings",
				label: dict.tabs.meanings,
				count: entry.meanings.length,
			},
			{
				id: "phraseology",
				label: dict.tabs.phraseology,
				count: entry.phraseology?.length ?? 0,
			},
			{
				id: "citations",
				label: dict.tabs.citations,
				count: entry.citations?.length ?? 0,
			},
		];
		if (isNoun) list.push({ id: "declension", label: dict.tabs.declension });
		if (isVerb) list.push({ id: "conjugation", label: dict.tabs.conjugation });
		list.push({
			id: "sources",
			label: dict.tabs.sources,
			count: entry.sources.length,
		});
		return list;
	}, [entry, dict, isVerb, isNoun]);

	const availableIds = useMemo(() => tabs.map(t => t.id), [tabs]);
	const { active, setActive } = useEntryTab(availableIds, "meanings");

	const renderPanel = () => {
		switch (active) {
			case "meanings":
				return (
					<MeaningsPanel
						meanings={entry.meanings}
						emptyLabel={dict.meanings.empty}
					/>
				);
			case "phraseology":
				return (
					<PhraseologyPanel
						items={entry.phraseology ?? []}
						emptyLabel={dict.phraseology.empty}
					/>
				);
			case "citations":
				return (
					<CitationsPanel
						citations={entry.citations ?? []}
						emptyLabel={dict.citations.empty}
					/>
				);
			case "declension":
				return (
					<DeclensionPanel
						word={entry.word}
						isApplicable={isNoun}
						dict={dict.declension}
					/>
				);
			case "conjugation":
				return (
					<ConjugationPanel
						word={entry.word}
						isApplicable={isVerb}
						dict={dict.conjugation}
					/>
				);
			case "sources":
				return (
					<SourcesPanel
						sources={entry.sources}
						emptyLabel={dict.sources.empty}
					/>
				);
		}
	};

	return (
		<>
			<div
				role="tablist"
				aria-label="Entry sections"
				className="flex gap-1 border-b border-edge mb-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{tabs.map(tab => {
					const isActive = active === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							role="tab"
							aria-selected={isActive}
							aria-controls={`panel-${tab.id}`}
							onClick={() => setActive(tab.id)}
							className={cn(
								"px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors",
								isActive
									? "text-primary border-primary"
									: "text-muted border-transparent hover:text-subtle",
							)}
						>
							{tab.label}
							{typeof tab.count === "number" && tab.count > 0 && (
								<span className="ml-1 text-[0.6rem] bg-surface-active px-1.5 py-px rounded-full text-faint font-normal">
									{tab.count}
								</span>
							)}
						</button>
					);
				})}
			</div>
			<div role="tabpanel" id={`panel-${active}`} className="animate-fade-in">
				{renderPanel()}
			</div>
		</>
	);
};
