import type { DictionaryEntry } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { EntryHero } from "@/widgets/entry-hero";
import { EntryTabs } from "@/widgets/entry-tabs";
import type { FC } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { StructuredData } from "./structured-data";

interface EntryPageProps {
	entry: DictionaryEntry;
	lang: string;
	dict: Dictionary["entry"];
	wordLevelDict: Dictionary["wordLevel"];
}

export const EntryPage: FC<EntryPageProps> = ({
	entry,
	lang,
	dict,
	wordLevelDict,
}) => (
	<>
		<StructuredData entry={entry} lang={lang} />
		<Breadcrumbs lang={lang} word={entry.word} dict={dict.breadcrumbs} />
		<EntryHero
			entry={entry}
			lang={lang}
			dict={dict}
			wordLevelDict={wordLevelDict}
		/>
		<EntryTabs entry={entry} dict={dict} />
	</>
);
