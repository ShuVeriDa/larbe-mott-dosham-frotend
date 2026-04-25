"use client";

import type { Meaning, Phrase } from "@/entities/dictionary";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/shared/lib";
import type { FC } from "react";

interface MeaningsEditorProps {
	meanings: Meaning[];
	onChange: (next: Meaning[]) => void;
	dict: Dictionary["admin"]["entryEdit"]["meanings"];
	placeholders: Dictionary["admin"]["entryEdit"]["placeholders"];
}

const emptyMeaning = (): Meaning => ({ translation: "", examples: [] });
const emptyExample = (): Phrase => ({ nah: "", ru: "" });

export const MeaningsEditor: FC<MeaningsEditorProps> = ({
	meanings,
	onChange,
	dict,
	placeholders,
}) => {
	const replace = (next: Meaning[]) => onChange(next);

	const updateMeaning = (index: number, patch: Partial<Meaning>) => {
		const copy = meanings.slice();
		copy[index] = { ...copy[index], ...patch };
		replace(copy);
	};

	const updateExample = (mi: number, ei: number, patch: Partial<Phrase>) => {
		const copy = meanings.slice();
		const exs = (copy[mi].examples ?? []).slice();
		exs[ei] = { ...exs[ei], ...patch };
		copy[mi] = { ...copy[mi], examples: exs };
		replace(copy);
	};

	const removeMeaning = (index: number) => {
		const copy = meanings.slice();
		copy.splice(index, 1);
		replace(copy);
	};

	const moveMeaning = (index: number, dir: -1 | 1) => {
		const target = index + dir;
		if (target < 0 || target >= meanings.length) return;
		const copy = meanings.slice();
		[copy[index], copy[target]] = [copy[target], copy[index]];
		replace(copy);
	};

	const addMeaning = () => replace([...meanings, emptyMeaning()]);

	const addExample = (index: number) => {
		const copy = meanings.slice();
		copy[index] = {
			...copy[index],
			examples: [...(copy[index].examples ?? []), emptyExample()],
		};
		replace(copy);
	};

	const removeExample = (mi: number, ei: number) => {
		const copy = meanings.slice();
		const exs = (copy[mi].examples ?? []).slice();
		exs.splice(ei, 1);
		copy[mi] = { ...copy[mi], examples: exs };
		replace(copy);
	};

	return (
		<div className="flex flex-col gap-3">
			{meanings.map((meaning, mi) => (
				<div
					key={mi}
					className={cn(
						"bg-[var(--surface)] border border-[var(--border)] rounded-md p-4",
						"border-l-[3px] border-l-[var(--accent)]",
					)}
				>
					<div className="flex items-center justify-between mb-3">
						<span className="text-xs font-bold text-[var(--accent)] font-mono">
							{dict.meaningNum.replace("{n}", String(mi + 1))}
						</span>
						<div className="flex gap-1">
							<button
								type="button"
								title={dict.moveUp}
								onClick={() => moveMeaning(mi, -1)}
								className="btn btn-sm btn-ghost w-7 h-7 p-0"
							>
								↑
							</button>
							<button
								type="button"
								title={dict.moveDown}
								onClick={() => moveMeaning(mi, 1)}
								className="btn btn-sm btn-ghost w-7 h-7 p-0"
							>
								↓
							</button>
							<button
								type="button"
								title={dict.remove}
								onClick={() => removeMeaning(mi)}
								className="btn btn-sm btn-ghost w-7 h-7 p-0 text-[var(--danger)] hover:bg-[var(--danger-dim)]"
							>
								×
							</button>
						</div>
					</div>

					<div className="mb-3">
						<div className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
							{dict.translation}
						</div>
						<input
							type="text"
							value={meaning.translation}
							onChange={(e) =>
								updateMeaning(mi, { translation: e.target.value })
							}
							placeholder={placeholders.translation}
							className="w-full px-3 py-2 h-9 bg-[var(--surface)] border border-[var(--border)] rounded-md text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
						/>
					</div>

					<div>
						<div className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
							{dict.examples}
						</div>
						{(meaning.examples ?? []).map((ex, ei) => (
							<div
								key={ei}
								className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 mb-2"
							>
								<input
									type="text"
									value={ex.nah}
									onChange={(e) =>
										updateExample(mi, ei, { nah: e.target.value })
									}
									placeholder={placeholders.chechen}
									className="px-2 py-1.5 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
								/>
								<input
									type="text"
									value={ex.ru}
									onChange={(e) =>
										updateExample(mi, ei, { ru: e.target.value })
									}
									placeholder={placeholders.russian}
									className="px-2 py-1.5 text-xs bg-[var(--bg)] border border-[var(--border)] rounded-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]"
								/>
								<button
									type="button"
									onClick={() => removeExample(mi, ei)}
									className="btn btn-sm btn-ghost text-[var(--danger)] hover:bg-[var(--danger-dim)]"
									title={dict.remove}
								>
									×
								</button>
							</div>
						))}
						<button
							type="button"
							onClick={() => addExample(mi)}
							className="text-xs text-[var(--accent)] bg-transparent border-none px-1 py-1 opacity-70 hover:opacity-100"
						>
							{dict.addExample}
						</button>
					</div>
				</div>
			))}

			<button
				type="button"
				onClick={addMeaning}
				className={cn(
					"w-full py-3 text-sm font-medium rounded-md border-2 border-dashed",
					"border-[var(--border)] text-[var(--text-muted)] bg-transparent",
					"hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]",
					"transition-colors",
				)}
			>
				{dict.addMeaning}
			</button>
		</div>
	);
};
