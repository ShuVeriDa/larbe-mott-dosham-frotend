"use client";

import { useBulkSearchAdminEntries } from "@/features/admin-entries";
import type { Dictionary } from "@/i18n/dictionaries";
import { useDebounce } from "@/shared/lib";
import { cn } from "@/shared/lib";
import { SectionCard } from "@/shared/ui/admin";
import { type FC, useState } from "react";
import type { SelectedEntry } from "../model";

interface Props {
	selected: SelectedEntry[];
	onToggle: (entry: SelectedEntry) => void;
	dict: Dictionary["admin"]["entriesBulk"]["select"]["search"];
}

export const BulkMethodSearch: FC<Props> = ({ selected, onToggle, dict }) => {
	const [query, setQuery] = useState("");
	const debounced = useDebounce(query, 300);
	const search = useBulkSearchAdminEntries(debounced, {
		enabled: debounced.trim().length >= 1,
	});

	const selectedIds = new Set(selected.map((s) => s.id));

	return (
		<SectionCard title={dict.title}>
			<input
				type="search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder={dict.placeholder}
				aria-label={dict.title}
				className="w-full h-10 bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-dim)] transition-colors"
			/>
			{debounced.trim().length === 0 ? (
				<p className="text-xs text-[var(--text-faint)] mt-3">{dict.minChars}</p>
			) : search.isError ? (
				<p className="text-sm text-[var(--danger)] mt-3">{dict.errorTitle}</p>
			) : search.isLoading ? (
				<p className="text-xs text-[var(--text-muted)] mt-3">{dict.loading}</p>
			) : !search.data || search.data.data.length === 0 ? (
				<p className="text-xs text-[var(--text-muted)] mt-3">{dict.empty}</p>
			) : (
				<ul
					className="max-h-[280px] overflow-y-auto border border-[var(--border)] rounded-md mt-3 divide-y divide-[var(--border)]"
					role="listbox"
					aria-multiselectable
				>
					{search.data.data.map((item) => {
						const isChecked = selectedIds.has(item.id);
						return (
							<li key={item.id}>
								<button
									type="button"
									role="option"
									aria-selected={isChecked}
									onClick={() =>
										onToggle({ id: item.id, word: item.word })
									}
									className={cn(
										"w-full flex items-center gap-3 px-3 py-2 text-sm text-left cursor-pointer transition-colors",
										isChecked
											? "bg-[var(--accent-dim)]"
											: "hover:bg-[var(--surface-hover)]",
									)}
								>
									<span
										className={cn(
											"w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center text-[0.6rem] shrink-0 transition-colors",
											isChecked
												? "bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-on)]"
												: "border-[var(--border-hover)] text-transparent",
										)}
										aria-hidden
									>
										✓
									</span>
									<span className="font-semibold text-[var(--text)]">
										{item.word}
									</span>
									{item.partOfSpeech ? (
										<span className="text-xs text-[var(--text-muted)]">
											{item.partOfSpeech}
										</span>
									) : null}
									<span className="ml-auto text-xs text-[var(--text-faint)] font-mono">
										#{item.id}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</SectionCard>
	);
};
