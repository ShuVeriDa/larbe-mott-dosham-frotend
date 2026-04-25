"use client";

import { useSources } from "@/entities/dictionary";
import type { NounClass } from "@/entities/dictionary";
import type { AdminEntriesSort } from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import type { WordLevel } from "@/shared/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui";
import type { FC } from "react";

const ALL = "__all__";

interface Props {
	q: string;
	onQChange: (value: string) => void;
	source: string;
	onSourceChange: (value: string) => void;
	cefr: WordLevel | "";
	onCefrChange: (value: WordLevel | "") => void;
	nounClass: NounClass | "";
	onNounClassChange: (value: NounClass | "") => void;
	entryType: "standard" | "neologism" | "";
	onEntryTypeChange: (value: "standard" | "neologism" | "") => void;
	sort: AdminEntriesSort;
	onSortChange: (value: AdminEntriesSort) => void;
	dict: Dictionary["admin"]["entries"]["toolbar"];
}

const SEARCH_ICON = (
	<svg
		width="15"
		height="15"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<circle cx="11" cy="11" r="8" />
		<path d="m21 21-4.3-4.3" />
	</svg>
);

const inputCls =
	"bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-sm text-[var(--text)] outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]";

const selectTriggerCls = "h-[38px] min-w-[140px]";

export const EntriesToolbar: FC<Props> = ({
	q,
	onQChange,
	source,
	onSourceChange,
	cefr,
	onCefrChange,
	nounClass,
	onNounClassChange,
	entryType,
	onEntryTypeChange,
	sort,
	onSortChange,
	dict,
}) => {
	const sourcesQuery = useSources();

	return (
		<div className="flex items-center gap-3 mb-4 flex-wrap">
			<label className="relative flex-1 min-w-[200px] max-w-[320px]">
				<span className="sr-only">{dict.searchPlaceholder}</span>
				<span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
					{SEARCH_ICON}
				</span>
				<input
					type="text"
					value={q}
					onChange={(e) => onQChange(e.target.value)}
					placeholder={dict.searchPlaceholder}
					className={`${inputCls} pl-9 pr-8 w-full`}
				/>
				{q ? (
					<button
						type="button"
						aria-label={dict.searchClear}
						onClick={() => onQChange("")}
						className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
					>
						✕
					</button>
				) : null}
			</label>

			<div className="hidden md:block w-px h-6 bg-[var(--border)] mx-1" />

			<div className="flex items-center gap-2 flex-wrap">
				<Select
					value={source === "" ? ALL : source}
					onValueChange={(value) =>
						onSourceChange(value === ALL ? "" : value)
					}
				>
					<SelectTrigger
						className={selectTriggerCls}
						aria-label={dict.allSources}
					>
						<SelectValue placeholder={dict.allSources} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.allSources}</SelectItem>
						{sourcesQuery.data?.map((s) => (
							<SelectItem key={s.slug} value={s.slug}>
								{s.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={cefr === "" ? ALL : cefr}
					onValueChange={(value) =>
						onCefrChange(value === ALL ? "" : (value as WordLevel))
					}
				>
					<SelectTrigger
						className={selectTriggerCls}
						aria-label={dict.allCefr}
					>
						<SelectValue placeholder={dict.allCefr} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.allCefr}</SelectItem>
						<SelectItem value="A">A</SelectItem>
						<SelectItem value="B">B</SelectItem>
						<SelectItem value="C">C</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={nounClass === "" ? ALL : nounClass}
					onValueChange={(value) =>
						onNounClassChange(value === ALL ? "" : (value as NounClass))
					}
				>
					<SelectTrigger
						className={selectTriggerCls}
						aria-label={dict.allClasses}
					>
						<SelectValue placeholder={dict.allClasses} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.allClasses}</SelectItem>
						<SelectItem value="vu">{dict.classVu}</SelectItem>
						<SelectItem value="yu">{dict.classYu}</SelectItem>
						<SelectItem value="du">{dict.classDu}</SelectItem>
						<SelectItem value="bu">{dict.classBu}</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={entryType === "" ? ALL : entryType}
					onValueChange={(value) =>
						onEntryTypeChange(
							value === ALL
								? ""
								: (value as "standard" | "neologism"),
						)
					}
				>
					<SelectTrigger
						className={selectTriggerCls}
						aria-label={dict.allTypes}
					>
						<SelectValue placeholder={dict.allTypes} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={ALL}>{dict.allTypes}</SelectItem>
						<SelectItem value="standard">{dict.typeStandard}</SelectItem>
						<SelectItem value="neologism">{dict.typeNeologism}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="hidden md:block w-px h-6 bg-[var(--border)] mx-1" />

			<Select
				value={sort}
				onValueChange={(value) => onSortChange(value as AdminEntriesSort)}
			>
				<SelectTrigger
					className={selectTriggerCls}
					aria-label={dict.sortRelevance}
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="relevance">{dict.sortRelevance}</SelectItem>
					<SelectItem value="asc">{dict.sortWordAsc}</SelectItem>
					<SelectItem value="desc">{dict.sortWordDesc}</SelectItem>
					<SelectItem value="updatedAt_desc">
						{dict.sortUpdatedDesc}
					</SelectItem>
					<SelectItem value="updatedAt_asc">{dict.sortUpdatedAsc}</SelectItem>
					<SelectItem value="createdAt_desc">
						{dict.sortCreatedDesc}
					</SelectItem>
					<SelectItem value="meaningsCount_desc">
						{dict.sortMeaningsDesc}
					</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
